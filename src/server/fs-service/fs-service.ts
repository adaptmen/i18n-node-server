import { countryCodes } from "../country-codes/country-codes";
import { FileWriter } from "./file-writer";
import * as fs from "fs";
import { validateIdent } from "./utils/valid-ident";
import { IDENT_EXISTS, IDENT_NOT_VALID } from "./errors";
import { FileReader } from "./file-reader";
import { existsSync, readdirSync } from "fs";
import { join } from "path";


export type Records = {[countryCode: string]: string};

export class FsService {

	constructor(private dataDirPath: string) {
		if (!fs.existsSync(dataDirPath)) {
			fs.mkdirSync(dataDirPath);
		}
	}

	static readonly emptyFileContent = countryCodes.reduce((acc, val) => {
		acc[val] = "";
		return acc;
	}, {});

	writeRecords(ident: string, records: Records): void | Error {
		const identIsValid = validateIdent(ident);
		if (!identIsValid) {
			return IDENT_NOT_VALID;
		}
		const empty = {...FsService.emptyFileContent};
		for (let countryCode in records) {
			if (FsService.emptyFileContent.hasOwnProperty(countryCode)) {
				empty[countryCode] = records[countryCode];
			}
		}
		const filePath = join(this.dataDirPath, ident + ".json");
		if (existsSync(filePath)) {
			return IDENT_EXISTS;
		}
		FileWriter.writeToFile(filePath, empty);
	}

	updateRecords(ident: string, records: Records): void | Error {
		const identIsValid = validateIdent(ident);
		if (!identIsValid) {
			return IDENT_NOT_VALID;
		}
		const filePath = join(this.dataDirPath, ident + ".json");
		const current = FileReader.readFile(filePath);
		if (current instanceof Error) {
			return current;
		}
		for (let countryCode in records) {
			if (FsService.emptyFileContent.hasOwnProperty(countryCode)) {
				current[countryCode] = records[countryCode];
			}
		}
		FileWriter.writeToFile(filePath, current);
	}

	updateRecord(ident: string, cc: string, value: string): void | Error {
		return this.updateRecords(ident, {[cc]: value});
	}

	getAllRecords() {
		const allRecords = readdirSync(this.dataDirPath)
		.filter(fileName => fileName.endsWith(".json"))
		.reduce((acc, fileName) => {
			const ident = fileName.replace(/.json$/g, "");
			acc[ident] = FileReader.readFile(join(this.dataDirPath, fileName));
			return acc;
		}, {"timestamp-i18n-tool": new Date().toISOString()});
		return allRecords;
	}

	getRecordsByIdent(ident: string): Records | Error {
		return FileReader.readFile(join(this.dataDirPath, ident + ".json"));
	}

}
