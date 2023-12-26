import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useOutletContext } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import {
	GoogleAuthProvider,
	User,
	getAuth,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { GetAuthTokenButton } from "~/components/GetAuthTokenButton";

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
const handleSignIn = () => {
	const provider = new GoogleAuthProvider();
	signInWithPopup(getAuth(), provider);
};
const handleSignOut = () => {
	signOut(getAuth());
};

function useRegisterMe(firebaseUser: User | null) {
	console.log("register me!!!!");
	return useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			if (firebaseUser === null) {
				return null;
			}
			const token = firebaseUser.getIdToken();
			const res = await fetch(`${window.BACKEND_URL}/me`, {
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
}

export default function Index() {
	const user = useOutletContext<User | null>();
	useRegisterMe(user);
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
				<GetAuthTokenButton user={user} />
			</div>
			{user ? (
				<div>
					<button type="button" onClick={handleSignOut}>
						logout
					</button>
					<button type="button">
						<Link to="/articles/new">New Article</Link>
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
