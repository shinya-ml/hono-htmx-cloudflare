/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from 'hono';
import { html } from 'hono/html';
import { jsxRenderer } from 'hono/jsx-renderer';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const renderer = jsxRenderer(({children}) => {
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
	`
})

const app = new Hono<{Bindings: {}}>()

app.get('*', renderer)
app.get('/issues/:id', async (c) => {
	const id = c.req.param('id')
	return c.render(
		<div>
			<h1>Hello World</h1>
		</div>
	)
})

export default app