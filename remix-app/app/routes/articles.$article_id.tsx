import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";

export async function loader({ params }: ClientLoaderFunctionArgs) {
	const res = await fetch(
		`http://localhost:8787/articles/${params.article_id}`,
	);
	if (!res.ok) {
		return {};
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
