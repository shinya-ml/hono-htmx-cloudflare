import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Hono, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

type Variables = {
	supabase: SupabaseClient;
};

const app = new Hono();
const supabase: MiddlewareHandler<{ Variables: Variables }> = async (
	c,
	next,
) => {
	const client = createServerClient("supabase url", "anon api key", {
		cookies: {
			get: (name) => {
				return getCookie(c, name);
			},
			set: (name, value, options) => {
				setCookie(c, name, value, options);
			},
			remove: (key, options) => {
				deleteCookie(c, key, options);
			},
		},
		cookieOptions: {
			httpOnly: true,
			secure: true,
		},
	});
	c.set("supabase", client);
	await next();
};

app.get("/", async (c) => {
	return c.html(<h1>Hogeeeeeeeee</h1>);
});

app.get("/auth", supabase, async (c) => {
	const { data, error } = await c.var.supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "http://localhost:8787/auth/callback",
		},
	});
	if (error) {
		return c.json({ error }, 403);
	}

	return c.json({ data }, 200);
});

app.get("/auth/callback", supabase, async (c) => {
	const code = c.req.query("code") ?? "";
	const next = c.req.query("next") ?? "/";
	console.log(c.var.supabase.auth.getSession());
	const { error } = await c.var.supabase.auth.exchangeCodeForSession(code);

	if (!error) {
		return c.redirect(next);
	}
	return c.json({ err: error, msg: "unauthorized" }, 401);
});

export default app;
