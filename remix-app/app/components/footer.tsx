import { AppBar, Toolbar } from "@mui/material";
import { useAuth } from "../auth";
import { GetAuthTokenButton } from "./GetAuthTokenButton";

export function Footer() {
	const user = useAuth();
	return (
		<AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
			<Toolbar>
				<GetAuthTokenButton user={user} />
			</Toolbar>
		</AppBar>
	);
}
