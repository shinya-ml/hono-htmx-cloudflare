import { Box, Container } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { useAuth } from "../auth";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export async function loader({ context }: LoaderFunctionArgs) {
	const fetched = await fetch(`${context.BACKEND_URL}/articles`);
	if (!fetched.ok) {
		throw new Response(fetched.body, { status: fetched.status });
	}
	const res: Article[] = await fetched.json();
	return {
		backend_url: context.BACKEND_URL,
		allArticles: res ?? [],
	};
}

type Article = {
	article_id: number;
	author_id: number;
	title: string;
	content: string;
};

function useRegisterMe(firebaseUser: User | null, backend_url: string) {
	const data = useQuery({
		queryKey: ["me", firebaseUser?.uid],
		queryFn: async () => {
			if (firebaseUser === null) {
				return null;
			}
			const token = await firebaseUser.getIdToken();
			const res = await fetch(`${backend_url}/me`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: firebaseUser.displayName,
					firebase_uid: firebaseUser.uid,
				}),
			});
			return res.json();
		},
	});
	return data;
}

export default function Index() {
	const {
		backend_url,
		allArticles,
	}: { backend_url: string; allArticles: Article[] } = useLoaderData();
	const user = useAuth();
	useRegisterMe(user, backend_url);
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<Box flex-direction="column">
				<Container maxWidth="lg">
					{allArticles.map((article) => (
						<div key={article.article_id}>
							<Link to={`/articles/${article.article_id}`}>
								{article.title}{" "}
							</Link>
							<div>著者id: {article.author_id}</div>
							<div>中身: {article.content}</div>
						</div>
					))}
				</Container>
			</Box>
		</div>
	);
}
