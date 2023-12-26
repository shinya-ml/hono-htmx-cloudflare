import { Button } from "@mui/material";
import { User } from "firebase/auth";

export function GetAuthTokenButton(props: { user: User | null }) {
	const firebaseUser = props.user;
	if (firebaseUser === null) {
		return null;
	}
	return (
		<div>
			<Button
				onClick={() => {
					firebaseUser
						.getIdToken()
						.then((token) => navigator.clipboard.writeText(token));
				}}
			>
				Firebase IDトークンをクリップボードにコピーする
			</Button>
		</div>
	);
}
