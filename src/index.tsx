import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Hono, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const app = new Hono();
app.get("/", async (c) => {
	return c.html(<h1>Hogeeeeeeeee</h1>);
});

export default app;
