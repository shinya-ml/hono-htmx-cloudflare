import { Box, Button, TextField, Typography } from "@mui/material";

export default function NewArticle() {
	return (
		<div>
			<Typography mt={2}>新しい記事を作るのぜ</Typography>
			<Box textAlign="center">
				<Typography mt={2}>Title</Typography>
				<TextField label="title" variant="filled" fullWidth />
				<Typography mt={2}>Content</Typography>
				<TextField
					label="content"
					variant="filled"
					fullWidth
					multiline
					rows={20}
				/>
				<Button variant="contained">投稿</Button>
			</Box>
		</div>
	);
}
