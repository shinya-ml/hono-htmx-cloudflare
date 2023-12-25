import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

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
app.post("/articles", async (c) => {
	const body = await c.req.json();
	console.log(body);
	return c.json({ id: 1 }, 201);
});

export default app;
