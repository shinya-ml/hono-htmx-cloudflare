import { Hono } from "hono";
const app = new Hono();
app.get("/", async (c) => {
	return c.html(<h1>Hogeeeeeeeee</h1>);
});
export default app;
