# BigSpace Clean — Prototype

A mobile-first cleaning request form for property owners/managers.
Every request is saved as one row in a Google Sheet, and emails go to the client and the company.

```
Client's phone ──► Svelte form (Vercel) ──POST JSON──► Apps Script web app ──► Google Sheet
                                                              └──► Emails (client + company)
```

### Run the frontend locally

```bash
cd frontend
npm install
cp .env.example .env.local   # then paste the 'App Script' deployment URL into VITE_GAS_ENDPOINT
npm run dev
```
