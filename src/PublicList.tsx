import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Box, Container, Paper } from "@material-ui/core";
import { CodeInput } from "./CodeInput";

const PublicList: React.FC<Record<string, never>> = (): JSX.Element => {
	const [code, setCode] = useState<string>("");
	return (
		<Box
			alignItems="center"
			display="flex"
			height="100vh"
			justifyContent="center"
			style={{ background: "#222" }}
		>
			<Container maxWidth="xs">
				<Paper>
					<Box p={4}>
						{code ? code : <CodeInput onSetCode={(code) => setCode(code)} />}
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

ReactDOM.render(<PublicList />, document.getElementById("public-list"));
