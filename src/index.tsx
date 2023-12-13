import { Hono } from "hono";
import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";

const renderer = jsxRenderer(({ children }) => {
	return html`
		<!DOCTYPE html>
		<html>
			<head>
				<script src="https://unpkg.com/htmx.org@1.9.9"></script>
			</head>
			<body>
				${children}
			</body>
		</html>
	`;
});

const app = new Hono();

app.get("*", renderer);
app.get("/", async (c) => {
	return c.html(<h1>Hogeeeeeeeee</h1>);
});
app.get("/issues/:id", async (c) => {
	const id = c.req.param("id");
	const issue = {
		id: id,
		title: "記事だお^o^",
	};
	return c.render(
		<div>
			<h2>ID: {issue.id}</h2>
			<h1>{issue.title}</h1>
		</div>,
	);
});

export default app;
