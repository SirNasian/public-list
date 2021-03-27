import React from "react";
import { TextField } from "@material-ui/core";
export default CodeInput;

export const CodeInput: React.FC<Record<string, never>> = () => (
	<TextField variant="outlined" size="small" fullWidth />
);
