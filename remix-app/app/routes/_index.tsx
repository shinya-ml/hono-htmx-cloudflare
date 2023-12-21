import type { MetaFunction } from "@remix-run/cloudflare";
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
			<div>
				{allArticles.map((article) => (
					<div key={article.id}>{article.title}</div>
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
