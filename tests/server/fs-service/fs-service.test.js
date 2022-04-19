const {FsService} = require("../../../dist/fs-service/fs-service");
const {countryCodes} = require("../../../dist/country-codes/country-codes");
const assert = require("assert");
const {join} = require("path");
const {existsSync, rmdirSync} = require("fs");


const dataDirPath = join(__dirname, "../../../data-test");

const fsService = new FsService(dataDirPath);

describe("FsService", () => {
	it("ensure data directory", () => {
		assert.strictEqual(existsSync(dataDirPath), true);
	});
	describe("write records", () => {
		it("file ident.1.json wrote", () => {
			fsService.writeRecords("ident.1", {"GB": "text 1"});
			assert.strictEqual(existsSync(join(dataDirPath, "ident.1.json")), true);
		});
		it("file ident.1.json has correct keys", () => {
			const records = fsService.getRecordsByIdent("ident.1");
			assert.deepStrictEqual(Object.keys(records), countryCodes);
		});
		it("file ident.1.json has correct values", () => {
			const records = fsService.getRecordsByIdent("ident.1");
			assert.strictEqual(records["GB"], "text 1");
		});
	});
	describe("write and update records", () => {
		it("file ident-2.json wrote", () => {
			fsService.writeRecords("ident-2", {"AL": "AL text 2"});
			assert.strictEqual(existsSync(join(dataDirPath, "ident-2.json")), true);
		});
		it("file ident-2.json was added text to GB country code", () => {
			fsService.updateRecord("ident-2", "GB", "GB text 2");
			const records = fsService.getRecordsByIdent("ident-2");
			assert.strictEqual(records["GB"], "GB text 2");
		});
		it("file ident-2.json was changed GB locale", () => {
			fsService.updateRecord("ident-2", "GB", "GB text 2 changed");
			const records = fsService.getRecordsByIdent("ident-2");
			assert.strictEqual(records["GB"], "GB text 2 changed");
		});
	});
	describe("All records", () => {
		it("Result object has correct fields", () => {
			const allRecords = fsService.getAllRecords();
			assert.deepStrictEqual(Object.keys(allRecords), ["timestamp-i18n-tool", "ident-2", "ident.1"]);
		});
		it("Result object has timestamp", () => {
			const allRecords = fsService.getAllRecords();
			assert.strictEqual(true, allRecords.hasOwnProperty("timestamp-i18n-tool"));
		});
	});
});

after(() => {
	rmdirSync(dataDirPath, {recursive: true});
});
