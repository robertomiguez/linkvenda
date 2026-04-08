# LinkVenda SaaS App 🚀

LinkVenda is a high-conversion, mobile-first SaaS web app that allows affiliate marketers to instantly create premium social media posts from product URLs.

## Project Architecture
- **Frontend Folder**: `frontend/` (Vite, Vue 3, TypeScript, Vanilla CSS)
- **Backend Folder**: `backend/` (Cloudflare Workers, Hono, D1 Database, HTMLRewriter)

## Quick Start (Local Development)

To run the application locally, you will need two terminal windows.

### 1. Start the Backend API (Cloudflare Worker)
Open your terminal and run:

```bash
cd backend
npm install
npm run dev
```

*Note: The local backend runs on `http://localhost:8787`. It utilizes a local D1 database for the `save` and `history` functionalities.*

### 2. Start the Frontend Application (Vite/Vue)
Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

*The frontend runs on `http://localhost:5173`. Open this URL in a mobile emulator or resize your browser to see the responsive layout.*

---

## Deployment Steps

### Deploying the Backend
Ensure you are logged into Wrangler (`npx wrangler login`). Then, deploy the Worker and establish the production D1 database:

1. Create the D1 Database for production:
```bash
cd backend
npx wrangler d1 create linkvenda-db
```
*(Update `wrangler.toml` with the generated `database_id`)*

2. Apply migrations/schema to production D1:
```bash
npx wrangler d1 execute linkvenda-db --file=./schema.sql --remote
```

3. Deploy the worker:
```bash
npm run deploy
```

*(Once deployed, obtain the production Worker URL and update `VITE_API_URL` in your frontend `.env` file!)*

### Deploying the Frontend (Cloudflare Pages)

1. Build the production application:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Cloudflare Pages:
```bash
npx wrangler pages deploy dist --project-name=linkvenda-app
```

## Features Complete ✅
- **Amazon scraping emulation**: Fetch requests send simulated browser headers natively backed up by `HTMLRewriter` to intelligently parse Amazon product names and prices while maintaining high stability against bot protection.
- **D1 SQLite Storage**: Keeps a consistent history of the user's generated posts.
- **Premium UI implementation**: Match-perfect pixel styles mirroring the provided prototype with dynamic gradients and soft UI principles.
- **Vanilla CSS styling**: Fast and highly maintainable architecture avoiding cumbersome generic utility classes while enforcing strict component encapsulation.
