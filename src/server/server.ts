import express from "express";
import { FsService } from "./fs-service/fs-service";
import { cliArgs } from "./cli/args";
import { countryCodes, namedCC } from "./country-codes/country-codes";
import { validateIdent } from "./fs-service/utils/valid-ident";
import { IDENT_NOT_VALID } from "./fs-service/errors";


const app = express();

app.use(express.json());

app.disable("x-powered-by");

const fsService = new FsService(cliArgs.data);

function setupRoutes() {
	app.get("/ping", (req, res) => {
		res.send("pong");
	});

	app.get("/api/named", (req, res) => {
		res.send(namedCC);
	});

	app.get("/api/cc", (req, res) => {
		res.send(countryCodes);
	});

	app.get("/api/all", (req, res) => {
		const allRecords = fsService.getAllRecords();
		res.send(allRecords);
	});

	app.get("/api/record/:ident", (req, res) => {
		const {ident} = req.params;
		const countryCode = req.query.countryCode as string;
		if (validateIdent(ident)) {
			const current = fsService.getRecordsByIdent(ident);
			if (current instanceof Error) {
				res.status(400).send(current.message);
			} else {
				if (countryCode && current.hasOwnProperty(countryCode)) {
					res.send(current[countryCode]);
				} else {
					res.send(current);
				}
			}
		} else {
			res.status(400).send(IDENT_NOT_VALID.message);
		}
	});

	app.put("/api/put-new", (req, res) => {
		const body = req.body;
		if (body && body.ident && body.records) {
			const error = fsService.writeRecords(body.ident, body.records);
			if (error) {
				res.status(400).send(error.message);
			} else {
				res.sendStatus(200);
			}
		} else {
			res.sendStatus(400);
		}
	});

	app.post("/api/update-records", (req, res) => {
		const body = req.body;
		if (body && body.ident && body.records) {
			const error = fsService.updateRecords(body.ident, body.records);
			if (error) {
				res.status(400).send(error.message);
			} else {
				res.sendStatus(200);
			}
		} else {
			res.sendStatus(400);
		}
	});

	app.post("/api/update-record", (req, res) => {
		const body = req.body;
		if (body && body.ident && body.countryCode && body.value != null) {
			const error = fsService.updateRecord(body.ident, body.countryCode, body.value);
			if (error) {
				res.status(400).send(error.message);
			} else {
				res.sendStatus(200);
			}
		} else {
			res.sendStatus(400);
		}
	});
}

function listen() {
	app.listen(cliArgs.port, () => {
		console.log("i18n-node-server listen at port", cliArgs.port);
	});
}

export {
	setupRoutes,
	listen,
	app
}
