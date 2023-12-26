import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import {
	GoogleAuthProvider,
	User,
	getAuth,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { useAuth } from "../auth";
import { GetAuthTokenButton } from "../components/GetAuthTokenButton";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

type Article = {
	article_id: number;
	author_id: number;
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
	console.log("start useregister me ", firebaseUser);
	const data = useQuery({
		queryKey: ["me", firebaseUser?.uid],
		queryFn: async () => {
			if (firebaseUser === null) {
				return null;
			}
			const token = await firebaseUser.getIdToken();
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
	return data;
}

export default function Index() {
	const user = useAuth();
	useRegisterMe(user);
	const allArticles: Article[] = useGetAllArticles();
	console.log(allArticles);
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Underground...</h1>
			<div>
				{allArticles.map((article) => (
					<div key={article.article_id}>
						<div>タイトル: {article.title}</div>
						<div>著者id: {article.author_id}</div>
						<div>中身: {article.content}</div>
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
