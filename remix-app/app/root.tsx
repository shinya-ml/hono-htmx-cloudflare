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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeApp } from "firebase/app";
import { Auth } from "./auth";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = async ({
	context,
}: LoaderFunctionArgs) => {
	return {
		FIREBASE_CONFIG: context.FIREBASE_CONFIG,
		BACKEND_URL: context.BACKEND_URL,
	};
};

declare global {
	interface Window {
		BACKEND_URL: string;
	}
}

const queryClient = new QueryClient();

export default function App() {
	const env = useLoaderData();
	initializeApp(JSON.parse(env.FIREBASE_CONFIG));
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
					<QueryClientProvider client={queryClient}>
						<Outlet />
						<script
							dangerouslySetInnerHTML={{
								__html: `window.BACKEND_URL = ${JSON.stringify(
									env.BACKEND_URL,
								)}`,
							}}
						/>
					</QueryClientProvider>
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
