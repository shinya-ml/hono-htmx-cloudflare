import { AppBar, Toolbar } from "@mui/material";
import { User } from "firebase/auth";
import { useAuth } from "../auth";
import { GetAuthTokenButton } from "./GetAuthTokenButton";

export function Footer(props: { user: User | null }) {
	// const user = useAuth();
	const user = props.user;
	return (
		<AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
			<Toolbar>
				<GetAuthTokenButton user={user} />
			</Toolbar>
		</AppBar>
	);
}
