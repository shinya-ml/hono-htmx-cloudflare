import {
	ClientLoaderFunctionArgs,
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";

export async function loader({ params }: ClientLoaderFunctionArgs) {
	const res = await fetch(
		`http://localhost:8787/articles/${params.article_id}`,
	);
	if (!res.ok) {
		throw new Response(res.body, { status: res.status });
	}
	return res.json();
}

export default function ArticleDetail() {
	const loader = useLoaderData();
	return (
		<div>
			<div>Article Detail</div>
			<div>{loader.article.title}</div>
			<div>{loader.article.content}</div>
			<div>{loader.article.author_name}</div>
		</div>
	);
}

export function ErrorBoundary() {
	const err = useRouteError();
	if (isRouteErrorResponse(err)) {
		return (
			<div>
				<h1>Oops!</h1>
				<pre>{err.status}</pre>
				<pre>{err.data}</pre>
			</div>
		);
	}

	const unknwonErr = JSON.stringify(err);
	return (
		<div>
			<h1>Unknown Error Happened</h1>
			<pre>{unknwonErr}</pre>
		</div>
	);
}
