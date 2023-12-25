import { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
	DB: D1Database;
};
const app = new Hono<{ Bindings: Bindings }>();

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
app.get("/articles", (c) => {
	return c.json([
		{
			id: 1,
			title: "article 1",
			author: "yanyan",
			content: "honoから来た記事だお",
		},
		{
			id: 2,
			title: "article 2",
			author: "yanyan",
			content: "honoから来た記事だお",
		},
		{
			id: 3,
			title: "article 3",
			author: "yanyan",
			content: "honoから来た記事だお",
		},
	]);
});

type Article = {
	title: string;
	content: string;
	author_id: number;
};
app.post("/articles", async (c) => {
	const body = await c.req.json<Article>();
	try {
		const { results } = await c.env.DB.prepare(
			"INSERT INTO articles (title, content, author_id) VALUES (?1, ?2, ?3) RETURNING article_id",
		)
			.bind(body.title, body.content, body.author_id)
			.run();
		return c.json({ article_id: results[0].article_id }, 201);
	} catch (e) {
		return c.json({ error: wrapError(e).message }, 500);
	}
});

export default app;
