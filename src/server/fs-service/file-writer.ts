import { writeFileSync } from "fs";
import { Records } from "./fs-service";


export class FileWriter {


	static writeToFile(path: string, data: Records) {
		writeFileSync(path, JSON.stringify(data));
	}

}
