import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Box, Container, Paper } from "@material-ui/core";
import { CodeInput } from "./CodeInput";
import { CustomList } from "./CustomList";

const defaultCode = document.getElementById("public-list").getAttribute("code");

const PublicList: React.FC<Record<string, never>> = (): JSX.Element => {
	const [code, setCode] = useState<string>(defaultCode);
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
						{code ? (
							<CustomList code={code} onBack={() => setCode("")} />
						) : (
							<CodeInput onSetCode={(code) => setCode(code)} />
						)}
					</Box>
				</Paper>
			</Container>
		</Box>
	);
};

ReactDOM.render(<PublicList />, document.getElementById("public-list"));
