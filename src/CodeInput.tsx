import React, { useState } from "react";
import { Box, Button, TextField } from "@material-ui/core";
export default CodeInput;

type CodeInputProps = {
	onSetCode: (code: string) => void;
};

export const CodeInput: React.FC<CodeInputProps> = ({
	onSetCode,
}: CodeInputProps): JSX.Element => {
	const [value, setValue] = useState<string>("");
	return (
		<Box display="flex">
			<TextField
				fullWidth
				label="List Code"
				onChange={(event) => setValue(event.target.value)}
				size="small"
				style={{ marginRight: "8px" }}
				value={value}
				variant="outlined"
			/>
			<Button
				color="primary"
				disableElevation
				onClick={() => onSetCode(value)}
				variant="contained"
			>
				GO
			</Button>
		</Box>
	);
};
