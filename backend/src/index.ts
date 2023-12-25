import { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
	DB: D1Database;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());
app.get("/", (c) => c.json({ message: "Hello World" }, 200));

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
		return c.json({ error: e.message }, 500);
	}
});

export default app;
