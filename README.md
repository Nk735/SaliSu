# SaliSu (Alfa Bari)

PWA full-stack in Next.js App Router per il carpooling quotidiano dei pendolari di Bari.

## 1. Configurazione locale

```bash
npm install
cp .env.example .env.local
npm run dev
```

Imposta in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

## 2. Supabase

1. Crea un progetto su [Supabase](https://supabase.com).
2. In **Authentication > Providers** abilita **Email**.
3. Abilita Email/Password e Magic Link/OTP nella sezione Email.
4. In **Authentication > URL Configuration** aggiungi:
   - Redirect URL locale: `http://localhost:3000/auth/callback`
   - Redirect URL Vercel: `https://<progetto>.vercel.app/auth/callback`
   - Imposta il sito principale sulle URL del progetto.
5. Esegui la migrazione iniziale:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

In alternativa, incolla il contenuto di `supabase/migrations/202611220001_initial_salisu.sql` nell'SQL Editor di Supabase. Opzionalmente esegui `supabase/seed.sql`.

La migrazione crea profili, tragitti, richieste posto, conversazioni, messaggi real-time, preferiti, recensioni e prezzi carburante, con policy RLS.

## 3. Deploy su Vercel

1. Importa la repository su Vercel.
2. Configura i quattro valori dell'.env in **Settings > Environment Variables**.
3. Imposta `CRON_SECRET` con un valore casuale sicuro.
4. Effettua il deploy.
5. Il cron giornaliero di `vercel.json` chiama `/api/fuel/update` alle 06:00 UTC.
   Anche manualmente: `https://<progetto>.vercel.app/api/fuel/update` con l'Authorization `Bearer <CRON_SECRET>`.

## 4. Comandi

```bash
npm run dev
npm run build
npm run start
```

L'app usa Supabase Realtime per messaggi e richieste posto. Il tema viene salvato in `localStorage`; i dati applicativi restano protetti da RLS.
