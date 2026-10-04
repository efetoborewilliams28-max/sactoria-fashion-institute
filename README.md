# SACTORIA FASHION INSTITUTE — Online Catalogue

A full-stack fashion catalogue built with Next.js (App Router), Supabase
(Database + Storage + Auth) and deployed on Vercel.

- **Public site (`/`)** — anyone can browse, filter by category, search,
  and tap "Enroll Now / Order Now" to message you on WhatsApp. No account
  needed, no editing possible.
- **Admin dashboard (`/admin`)** — only you (signed in through Supabase
  Auth) can add, edit, hide, or delete items, upload images, and edit
  your contact details, socials and homepage tagline.

Security is enforced twice: the `/admin` pages redirect to login if
you're not signed in, **and** the database itself (Row Level Security)
refuses any write that doesn't come from an authenticated user — so
even if someone bypassed the page, the database would still say no.

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name (e.g. `sactoria-fashion-institute`), a strong database
   password (save it somewhere safe), and a region close to Nigeria
   (e.g. an EU region).
3. Wait for the project to finish provisioning (~2 minutes).

## 2. Create the database tables + storage bucket

1. In your Supabase project, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy the whole file,
   paste it into the SQL editor, and click **Run**.

This one script creates:
- the `catalogue_items` table
- the `site_settings` table (with one starter row)
- the `catalogue-images` storage bucket
- **every Row Level Security policy** described below

### What the RLS policies actually enforce
- **Anyone (logged out)** can only `select` rows from `catalogue_items`
  where `is_visible = true`. They cannot insert, update or delete
  anything — the database rejects it even if someone calls the API
  directly.
- **Anyone (logged out)** can only view files in the `catalogue-images`
  bucket. Uploading requires being signed in.
- **A signed-in admin** (any authenticated Supabase user) can read,
  insert, update and delete catalogue items, update `site_settings`,
  and upload/replace images.

Because RLS is table-level, there is nothing sensitive in the frontend
code — the app only ever uses the public **anon key**, never the
`service_role` key.

## 3. Configure authentication

1. In Supabase, go to **Authentication → Providers** and make sure
   **Email** is enabled (it is by default).
2. Go to **Authentication → Users → Add user → Create new user**.
3. Enter your own email and a strong password. This is your admin
   login for `/admin`. You can add more admin users the same way —
   every confirmed Supabase Auth user can manage the catalogue.
4. Optional but recommended: under **Authentication → Providers →
   Email**, turn off "Enable email confirmations" for this single
   admin account flow, or confirm the account from the Users table
   (there's a "..." menu → "Confirm email") so you can sign in right
   away without needing to click a confirmation email.

## 4. Get your API keys

Go to **Project Settings → API**. You'll need:
- **Project URL** (`https://xxxx.supabase.co`)
- **anon public** key

You will **never** need the `service_role` key for this app — do not
put it anywhere in the project or in Vercel.

## 5. Run it locally (optional but recommended first)

```bash
npm install
cp .env.local.example .env.local
```

Edit `.env.local` and paste in your Project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then:

```bash
npm run dev
```

Visit `http://localhost:3000` for the public catalogue and
`http://localhost:3000/admin` to sign in and start adding items.

## 6. Push the project to GitHub

```bash
git init
git add .
git commit -m "Sactoria Fashion Institute catalogue"
```

Create a new empty repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

## 7. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import the GitHub repository you just pushed.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
4. Click **Deploy**. Vercel will build and give you a live URL like
   `https://sactoria-fashion-institute.vercel.app`.

That URL's homepage (`/`) is your public catalogue link — share it
with customers. The `/admin` path on the same domain is your private
dashboard.

## 8. Sign in and set up your catalogue

1. Visit `https://your-site.vercel.app/admin`.
2. Sign in with the admin email/password you created in Step 3.
3. Go to **Settings** first and fill in your real institute name,
   logo, phone, WhatsApp number, email, address and social links —
   these replace the placeholders shown on the public homepage.
4. Go to **Add item** to create your first catalogue entries: name,
   description, price in Naira, category, an image, and (optionally)
   a custom WhatsApp message.
5. Toggle **Hidden** on any item you're not ready to publish yet —
   it stays in your dashboard but disappears from the public site.

## Everyday use

- **Change a price or photo**: `/admin` → **Edit** on that item →
  update the price or upload a new image → **Save changes**. The
  public catalogue updates immediately, no redeploy needed.
- **Add a new course or piece**: `/admin` → **Add item**.
- **Update your WhatsApp number, logo or socials**: `/admin` →
  **Settings**.
- **Add another admin**: Supabase → Authentication → Users → Add user.

## Project structure

```
app/
  page.tsx                     Public homepage + catalogue
  admin/
    login/page.tsx             Admin sign-in (no nav, public route)
    (dashboard)/layout.tsx     Nav + logout, wraps every admin page below
    (dashboard)/page.tsx       Admin item list (edit/hide/delete)
    (dashboard)/items/new/     Add item form
    (dashboard)/items/[id]/edit/  Edit item form
    (dashboard)/settings/      Site settings form
components/                    Shared UI (cards, forms, buttons)
lib/supabase/                  Browser + server Supabase clients
middleware.ts                  Redirects unauthenticated visitors away from /admin
supabase/schema.sql            Full database schema + RLS policies
```

## Notes

- Images are served from Supabase Storage's public CDN URLs — fast
  on mobile data.
- The catalogue grid is 2 columns on phones, up to 4 on desktop, and
  every button and form is sized for touch.
- Placeholder contact details (address/phone/email) simply don't
  render until you fill them in under Settings — nothing fake is
  shown to customers.
