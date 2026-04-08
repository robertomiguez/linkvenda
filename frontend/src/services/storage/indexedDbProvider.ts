import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { HistoryItem, SavePostData } from '../../types';
import type { StorageProvider } from './types';

interface LinkvendaDB extends DBSchema {
  products: {
    key: string;
    value: {
      id: string;
      url: string;
      title: string;
      price: string;
      image: string;
      created_at: string;
    };
    indexes: { 'by-url': string };
  };
  posts: {
    key: string;
    value: {
      id: string;
      product_id: string;
      content: string;
      template: string;
      created_at: string;
    };
    indexes: { 'by-created': string };
  };
}

const DB_NAME = 'linkvenda_db';
const DB_VERSION = 1;

export class IndexedDbProvider implements StorageProvider {
  private dbPromise: Promise<IDBPDatabase<LinkvendaDB>>;

  constructor() {
    this.dbPromise = openDB<LinkvendaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('by-url', 'url', { unique: true });
        }
        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', { keyPath: 'id' });
          postStore.createIndex('by-created', 'created_at');
        }
      },
    });
  }

  async savePost(data: SavePostData): Promise<string> {
    const db = await this.dbPromise;
    const tx = db.transaction(['products', 'posts'], 'readwrite');
    const productStore = tx.objectStore('products');
    const postStore = tx.objectStore('posts');

    // Check if product already exists
    let productUrlIndex = productStore.index('by-url');
    let existingProduct = await productUrlIndex.get(data.url);
    
    let productId = existingProduct ? existingProduct.id : crypto.randomUUID();

    if (existingProduct) {
      await productStore.put({
        ...existingProduct,
        title: data.title,
        price: data.price,
        image: data.image
      });
    } else {
      await productStore.add({
        id: productId,
        url: data.url,
        title: data.title,
        price: data.price,
        image: data.image,
        created_at: new Date().toISOString()
      });
    }

    const postId = crypto.randomUUID();
    await postStore.add({
      id: postId,
      product_id: productId,
      content: data.content,
      template: data.template || 'Aleatório',
      created_at: new Date().toISOString()
    });

    await tx.done;
    return postId;
  }

  async getHistory(): Promise<HistoryItem[]> {
    const db = await this.dbPromise;
    const [posts, products] = await Promise.all([
      db.getAllFromIndex('posts', 'by-created'),
      db.getAll('products'),
    ]);
    posts.reverse(); // Newest first

    // Build a lookup map to avoid N+1 individual reads
    const productMap = new Map(products.map(p => [p.id, p]));

    return posts.reduce<HistoryItem[]>((items, post) => {
      const product = productMap.get(post.product_id);
      if (product) {
        items.push({
          id: post.id,
          content: post.content,
          template: post.template,
          created_at: post.created_at,
          url: product.url,
          title: product.title,
          price: product.price,
          image: product.image,
        });
      }
      return items;
    }, []);
  }

  async exportBackup(): Promise<string> {
    const db = await this.dbPromise;
    const products = await db.getAll('products');
    const posts = await db.getAll('posts');
    
    return JSON.stringify({ products, posts });
  }

  async importBackup(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    if (!Array.isArray(data?.products) || !Array.isArray(data?.posts)) {
      throw new Error('Formato de backup inválido.');
    }

    const db = await this.dbPromise;
    const tx = db.transaction(['products', 'posts'], 'readwrite');
    
    await tx.objectStore('products').clear();
    for (const product of data.products) {
      await tx.objectStore('products').put(product);
    }

    await tx.objectStore('posts').clear();
    for (const post of data.posts) {
      await tx.objectStore('posts').put(post);
    }

    await tx.done;
  }
}
