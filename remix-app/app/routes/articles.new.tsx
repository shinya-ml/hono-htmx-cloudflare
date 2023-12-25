import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function NewArticle() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const mutation = useMutation({
		mutationFn: async () => {
			const token = await getAuth().currentUser?.getIdToken();
			return fetch(`${window.BACKEND_URL}/articles`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, content, author_id: 1 }),
			});
		},
	});
	return (
		<div>
			<Typography mt={2}>新しい記事を作るのぜ</Typography>
			<Box textAlign="center">
				<Typography mt={2}>Title</Typography>
				<TextField
					label="title"
					variant="filled"
					fullWidth
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Typography mt={2}>Content</Typography>
				<TextField
					label="content"
					variant="filled"
					fullWidth
					multiline
					rows={20}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Button variant="contained" onClick={() => mutation.mutate()}>
					投稿
				</Button>
			</Box>
		</div>
	);
}
