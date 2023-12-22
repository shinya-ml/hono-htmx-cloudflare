import type { MetaFunction } from "@remix-run/cloudflare";
import { useQuery } from "@tanstack/react-query";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { useAuth } from "../auth";

const handleSignIn = () => {
	const provider = new GoogleAuthProvider();
	signInWithPopup(getAuth(), provider);
};

const handleSignOut = () => {
	signOut(getAuth());
};

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

type Article = {
	id: number;
	author: string;
	title: string;
	content: string;
};

function useGetAllArticles() {
	const res = useQuery<Article[]>({
		queryKey: ["articles"],
		queryFn: async () => {
			const res = await fetch(`${window.BACKEND_URL}/articles`);
			return res.json();
		},
	});
	return res.data ?? [];
}

export default function Index() {
	const user = useAuth();
	const allArticles: Article[] = useGetAllArticles();
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Underground...</h1>
			<div>
				{allArticles.map((article) => (
					<div key={article.id}>
						<div>{article.title}</div>
						<div>{article.author}</div>
						<div>{article.content}</div>
					</div>
				))}
			</div>
			{user ? (
				<div>
					<button type="button" onClick={handleSignOut}>
						logout
					</button>
				</div>
			) : (
				<button type="button" onClick={handleSignIn}>
					login
				</button>
			)}
		</div>
	);
}
