import { readFileSync } from "fs";
import { FILE_NOT_FOUND } from "./errors";
import { Records } from "./fs-service";


export class FileReader {

	static readFile(path: string): Records | Error {
		try {
			const data = readFileSync(path).toString("utf-8");
			return JSON.parse(data);
		} catch (err) {
			return FILE_NOT_FOUND;
		}
	}

}
