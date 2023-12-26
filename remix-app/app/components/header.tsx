import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
	GoogleAuthProvider,
	User,
	getAuth,
	signInWithPopup,
	signOut,
} from "firebase/auth";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#1976d2",
		},
	},
});

const handleSignIn = () => {
	const provider = new GoogleAuthProvider();
	signInWithPopup(getAuth(), provider);
};

const handleSignOut = () => {
	signOut(getAuth());
};
export function Header(props: { user: User | null }) {
	return (
		<ThemeProvider theme={darkTheme}>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h4" sx={{ flexGrow: 1 }}>
							記事アプリ
						</Typography>
						{props.user ? (
							<Button onClick={handleSignOut}>Logout</Button>
						) : (
							<Button onClick={handleSignIn}>Login</Button>
						)}
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>
	);
}
