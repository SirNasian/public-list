// CLI Options
const argv = require("yargs")
	.option("server-port", {
		alias: "p",
		description: "the port for the server to listen on",
		type: "number",
	})
	.option("database-host", {
		alias: "h",
		description: "PostgreSQL database address/hostname",
		type: "number",
	})
	.option("database-port", {
		alias: "P",
		description: "PostgreSQL database port",
		type: "number",
	})
	.option("database-name", {
		alias: "n",
		description: "PostgreSQL database",
		type: "string",
	})
	.option("database-user", {
		alias: "u",
		description: "PostgreSQL database username",
		type: "string",
	})
	.option("database-pass", {
		alias: "q",
		description: "PostgreSQL database password for given user",
		type: "string",
	}).argv;

// PostgreSQL Connection
const { Client } = require("pg");
const dbClient = new Client();

if (argv["database-host"])
	dbClient.connectionParameters.host = argv["database-host"];
if (argv["database-port"])
	dbClient.connectionParameters.port = argv["database-port"];
if (argv["database-name"])
	dbClient.connectionParameters.database = argv["database-name"];
if (argv["database-user"])
	dbClient.connectionParameters.user = argv["database-user"];
if (argv["database-pass"])
	dbClient.connectionParameters.password = argv["database-pass"];

dbClient
	.connect()
	.then(() => console.log("Connected to database successfully"))
	.catch((err) => console.log(err.message));

// Express Server/API
const express = require("express");
const app = express();
const port = argv.port ? argv.port : 3000;

app.use("/", express.static("./public/"));

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
