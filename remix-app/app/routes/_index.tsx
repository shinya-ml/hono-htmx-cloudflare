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
	detail: string;
};

export default function Index() {
	const test = useQuery({
		queryKey: ["test"],
		queryFn: async () => {
			const res = await fetch("http://localhost:8787");
			return res.json();
		},
	});
	const user = useAuth();
	const allArticles: Article[] = [
		{
			id: 1,
			title: "article 1",
			author: "yanyan",
			detail: "わーい^^",
		},
		{
			id: 2,
			title: "article 2",
			author: "shinya",
			detail: "ぶーん",
		},
	];
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Remix</h1>
			<div>{JSON.stringify(test.data)}</div>
			<div>
				{allArticles.map((article) => (
					<div key={article.id}>
						<div>{article.title}</div>
						<div>{article.author}</div>
						<div>{article.detail}</div>
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
