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

If `VITE_GAS_ENDPOINT` is empty, the form runs in demo mode: nothing is sent, and the thank-you screen shows a fake request ID.

### Set up the Apps Script backend

1. Create a Google Sheet, then open **Extensions > Apps Script**.
2. Copy `apps-script/Code.gs` and `apps-script/appsscript.json` into the editor.
   To see `appsscript.json`, turn on **Project Settings > Show "appsscript.json" manifest file in editor**.
3. Run `setup()` once and allow the permissions. It creates the `依頼一覧` sheet with the headers and the status dropdown.
4. Optional: in **Project Settings > Script Properties**, add `NOTIFY_EMAIL` with the company's address.
   If it is not set, notifications go to the account that deployed the script.
5. **Deploy > New deployment > Web app**, with *Execute as: Me* and *Who has access: Anyone*.
   Put the `/exec` URL in `VITE_GAS_ENDPOINT` (`frontend/.env.local`, and the Vercel environment variables).

To test without the form, run `testDoPost()` (saves a row and sends both emails to you) or `testInvalidPost()` (should be rejected).
After changing the code, use **Deploy > Manage deployments > Edit > Version: New version**, so the URL stays the same.
