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
const port = argv["server-port"] ? argv["server-port"] : 3000;

app.use("/", express.static("./public/"));
app.use(express.json());
app.use(require("cors")());

function ensureProp(value, name, res) {
	if (value === undefined)
		res.status(400).send(`Missing required property \`${name}\``);
	return value !== undefined;
}

app.post("/items/create", (req, res) => {
	dbClient
		.query(
			'CREATE TABLE "items" (' +
				'"id"    CHAR(36),' +
				'"code"  VARCHAR(80),' +
				'"value" VARCHAR(80),' +
				'"done"  BOOLEAN,' +
				'PRIMARY KEY ("id"))'
		)
		.then(() => res.status(200).send("Successfully initialised `items`"))
		.catch((err) => res.status(500).send(err.message));
});

app.post("/items/drop", (req, res) => {
	dbClient
		.query('DROP TABLE "items"')
		.then(() => res.status(200).send("Successfully destroyed `items`"))
		.catch((err) => res.status(500).send(err.message));
});

app.post("/items", (req, res) => {
	if (
		ensureProp(req.body.id, "id", res) &&
		ensureProp(req.body.code, "code", res) &&
		ensureProp(req.body.value, "value", res) &&
		ensureProp(req.body.done, "done", res)
	) {
		dbClient
			.query(
				'INSERT INTO "items" VALUES ($1, $2, $3, $4) ON CONFLICT ("id") DO UPDATE SET "value" = $3, "done" = $4',
				[req.body.id, req.body.code, req.body.value, req.body.done]
			)
			.then(() => res.status(200).send("Successfully updated item"))
			.catch((err) => res.status(500).send(err.message));
	}
});

app.get("/items", (req, res) => {
	dbClient
		.query('SELECT * FROM "items"')
		.then((dbRes) => res.status(200).send(dbRes.rows))
		.catch((err) => res.status(400).send(err.message));
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
