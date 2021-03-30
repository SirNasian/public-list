const argv = require("yargs").option("port", {
	alias: "p",
	description: "the port for the server to listen on",
	type: "number",
}).argv;

const express = require("express");
const app = express();
const port = argv.port ? argv.port : 3000;

app.use("/", express.static("./public/"));

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
