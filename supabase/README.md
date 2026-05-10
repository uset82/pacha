# Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor.
3. Enable email magic links in Auth.
4. Add your Netlify and local callback URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
5. Create the owner account through Supabase Auth, then add it to `admin_users`:

```sql
insert into public.admin_users (user_id, email)
values ('AUTH_USER_ID_HERE', 'owner@example.com');
```

6. Set the app environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` only for server-only maintenance scripts if needed
