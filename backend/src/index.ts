import { D1Database } from "@cloudflare/workers-types";
import { Auth, WorkersKVStoreSingle } from "firebase-auth-cloudflare-workers";
import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";

type Bindings = {
	DB: D1Database;
	PUBLIC_JWK_CACHE_KEY: string;
	PUBLIC_JWK_CACHE_KV: KVNamespace;
	PROJECT_ID: string;
};
type Variables = {
	my_firebase_uid: string;
};
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function wrapError(e: unknown): Error {
	if (e instanceof Error) {
		return e;
	}
	return new Error(String(e));
}

app.use("*", cors());
app.get("/", (c) => c.json({ message: "Hello World" }, 200));

// author系
type Author = {
	name: string;
	firebase_uid: string;
};

// check bearer token
async function authMiddleware(c: Context, next: Next) {
	const tokenWithBearer = c.req.header("Authorization");
	if (tokenWithBearer === null || tokenWithBearer === undefined) {
		return c.json({ error: "Authorization header is not found" }, 400);
	}
	const token = tokenWithBearer.replace("Bearer ", "");
	const auth = Auth.getOrInitialize(
		c.env.PROJECT_ID,
		WorkersKVStoreSingle.getOrInitialize(
			c.env.PUBLIC_JWK_CACHE_KEY,
			c.env.PUBLIC_JWK_CACHE_KV,
		),
	);
	try {
		const res = await auth.verifyIdToken(token, c.env);
		c.set("my_firebase_uid", res.uid);
	} catch (e) {
		return c.json({ error: wrapError(e).message }, 401);
	}
	await next();
}
// const firebaseApp = initializeApp({});
app.use("/me", authMiddleware);
app.post("/me", async (c) => {
	const body = await c.req.json<Author>();
	//存在チェック
	try {
		const results = await c.env.DB.prepare(
			"SELECT author_id FROM authors_firebase_info WHERE firebase_uid = ?1",
		)
			.bind(body.firebase_uid)
			.first();
		if (results) {
			return c.json({ author_id: results.author_id }, 200);
		}
	} catch (e) {
		return c.json({ error: wrapError(e).message }, 500);
	}
	// register to authors
	// register to author_profile
	// register to authors_firebase_info
	try {
		const insertedAuthors = await c.env.DB.prepare(
			"INSERT INTO authors DEFAULT VALUES RETURNING author_id",
		).first();
		if (insertedAuthors) {
			await c.env.DB.batch([
				c.env.DB.prepare(
					"INSERT INTO authors_firebase_info (author_id, firebase_uid) VALUES (?1, ?2)",
				).bind(insertedAuthors.author_id, body.firebase_uid),
				c.env.DB.prepare(
					"INSERT INTO author_profiles (author_id, author_name) VALUES (?1, ?2)",
				).bind(insertedAuthors.author_id, body.name),
			]);
			return c.json({ author_id: insertedAuthors.author_id }, 201);
		}
	} catch (e) {
		return c.json({ error: wrapError(e).message }, 500);
	}
});

// 記事系
app.get("/articles", async (c) => {
	const res = await c.env.DB.prepare(
		"SELECT article_id, title, content, author_id FROM articles",
	).all();
	return c.json(res.results ?? [], 200);
});

type Article = {
	title: string;
	content: string;
};
app.post("/articles", authMiddleware, async (c) => {
	const body = await c.req.json<Article>();
	const uid = c.get("my_firebase_uid");
	try {
		const me = await c.env.DB.prepare(
			"select author_id from authors_firebase_info where firebase_uid = ?1",
		)
			.bind(uid)
			.first();
		if (!me) {
			return c.json({ error: "author not found" }, 500);
		}
		const { results } = await c.env.DB.prepare(
			"INSERT INTO articles (title, content, author_id) VALUES (?1, ?2, ?3) RETURNING article_id",
		)
			.bind(body.title, body.content, me.author_id)
			.run();
		return c.json({ article_id: results[0].article_id }, 201);
	} catch (e) {
		return c.json({ error: wrapError(e).message }, 500);
	}
});
app.get("/articles/:article_id", async (c) => {
	const article_id = c.req.param("article_id");
	try {
		const article = await c.env.DB.prepare(
			"SELECT title, content, author_name FROM articles INNER JOIN author_profiles USING(author_id) WHERE article_id = ?1",
		)
			.bind(article_id)
			.first();
		if (article === null) {
			return c.json({ error: "article not found" }, 404);
		}
		return c.json({ article: article }, 200);
	} catch (e) {
		return c.json({ error: wrapError(e).message }, 500);
	}
});

export default app;
