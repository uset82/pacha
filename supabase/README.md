# Supabase Setup

1. Create a Supabase project.
2. Run the SQL files in `supabase/migrations` in order from the SQL editor.
3. Enable email magic links in Auth.
4. Add your Netlify and local callback URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/client-callback`
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/auth/client-callback`
5. Create the owner account through Supabase Auth, then add it to `admin_users`:

```sql
insert into public.admin_users (user_id, email)
values ('AUTH_USER_ID_HERE', 'owner@example.com');
```

6. Set the app environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` preferred, or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SECRET_KEY` preferred, or legacy `SUPABASE_SERVICE_ROLE_KEY`, only for server-only maintenance scripts if needed

The owner CMS uses the authenticated user's session plus RLS policies. Do not put secret or service-role keys in `NEXT_PUBLIC_` variables.

For server-side magic links, set the Supabase Magic Link email template href to:

```html
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/admin
```

Using only `{{ .RedirectTo }}` will send users back to the app without a login code.
