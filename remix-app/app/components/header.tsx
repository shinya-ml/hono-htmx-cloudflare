import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { useAuth } from "../auth";

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
export function Header() {
	const user = useAuth();
	return (
		<ThemeProvider theme={darkTheme}>
			<Box sx={{ display: "flex" }}>
				<AppBar position="static" sx={{ top: 0, bottom: "auto" }}>
					<Toolbar>
						<Typography variant="h4" sx={{ flexGrow: 1 }}>
							記事アプリ
						</Typography>
						{user ? (
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
