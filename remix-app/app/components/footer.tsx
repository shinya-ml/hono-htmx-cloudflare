import { AppBar, Toolbar } from "@mui/material";
import { User } from "firebase/auth";
import { GetAuthTokenButton } from "./GetAuthTokenButton";

export function Footer(props: { user: User | null }) {
	return (
		<AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
			<Toolbar>
				<GetAuthTokenButton user={props.user} />
			</Toolbar>
		</AppBar>
	);
}
