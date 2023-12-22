import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());
app.get("/", (c) => c.json({ message: "Hello World" }, 200));

export default app;
