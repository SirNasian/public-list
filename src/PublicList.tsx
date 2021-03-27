import React from "react";
import ReactDOM from "react-dom";
import { Box, Container, Grid, Paper, Typography } from "@material-ui/core";
import { CodeInput } from "./CodeInput";

const PublicList: React.FC<Record<string, never>> = () => (
	<Box
		alignItems="center"
		display="flex"
		height="100vh"
		justifyContent="center"
		style={{ background: "#222" }}
	>
		<Container maxWidth="xs">
			<Paper>
				<Box px={4} py={2}>
					<Grid container direction="column" spacing={2}>
						<Grid item>
							<Typography variant="h4">Public List</Typography>
						</Grid>
						<Grid item>
							<CodeInput />
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	</Box>
);

ReactDOM.render(<PublicList />, document.getElementById("public-list"));
