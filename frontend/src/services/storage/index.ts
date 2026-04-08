import { IndexedDbProvider } from './indexedDbProvider';
import type { StorageProvider } from './types';

// Depending on configuration or environment, we could easily swap this 
// for CloudStorageProvider, LocalStorageProvider, etc.
const storage: StorageProvider = new IndexedDbProvider();

export default storage;
