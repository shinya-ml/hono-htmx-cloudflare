import type { MetaFunction } from "@remix-run/cloudflare";
import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { useAuth } from "../auth";
import { GetAuthTokenButton } from "../components/GetAuthTokenButton";
import { Header } from "../components/header";

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
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<Header user={user} />
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
		</div>
	);
}
