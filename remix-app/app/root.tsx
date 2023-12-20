import type {
	LinksFunction,
	LoaderFunction,
	LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import { initializeApp } from "firebase/app";
import { Auth } from "./auth";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = async ({
	context,
}: LoaderFunctionArgs) => {
	// const config = String(context.env.FIREBASE_CONFIG);
	const config = '{"hoge": "hoge"}';
	return JSON.parse(config);
};

export default function App() {
	const firebaseConfig = useLoaderData();
	console.log(firebaseConfig);
	initializeApp(firebaseConfig);
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Auth>
					<Outlet />
				</Auth>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	console.log(error);
	return <div>error</div>;
}
