## Marquis

Simple React + Vite client and Node.js server app.

### Prerequisites

- Node.js and npm installed.

### Environment variables

Create a `.env` file in any package that needs secrets (for example the `server` directory) and **do not commit it to git**.

Common examples:

- API keys
- Database URLs
- JWT secrets

Ask your team or check project notes for the exact variables your setup needs.

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Run the app

In two terminals:

```bash
cd client
npm run dev
```

```bash
cd server
npm start
```

Then open the URL printed by the client dev server in your browser.

