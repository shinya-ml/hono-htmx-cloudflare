import { Box } from "@mui/material";
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
import { AuthProvider } from "./auth";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = async ({
	context,
}: LoaderFunctionArgs) => {
	return {
		FIREBASE_CONFIG: context.FIREBASE_CONFIG,
	};
};

declare global {
	interface Window {
		BACKEND_URL: string;
	}
}

const queryClient = new QueryClient();

export default function App() {
	const context = useLoaderData();
	initializeApp(JSON.parse(context.FIREBASE_CONFIG));
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<Box flexDirection="column">
							<Header />
							<Outlet />
							<Footer />
						</Box>
					</AuthProvider>
				</QueryClientProvider>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (error instanceof Error) {
		return <div>{error.message}</div>;
	}
	const err = JSON.stringify(error);
	return <div>{err}</div>;
}
