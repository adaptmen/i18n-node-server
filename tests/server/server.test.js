const request = require("supertest");
const assert = require("assert");
const {app, setupRoutes} = require("../../dist/server");
const {namedCC, countryCodes} = require("../../dist/country-codes/country-codes");
const {FsService} = require("../../dist/fs-service/fs-service");
const {rmdirSync} = require("fs");
const {join} = require("path");


setupRoutes();

describe("API tests", () => {
	it("/ping", (done) => {
		request(app)
			.get("/ping")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.text, "pong");
				return done();
		});
	});

	it("/api/named", (done) => {
		request(app)
			.get("/api/named")
			.end((err, res) => {
				if (err) return done(err);
				assert.deepStrictEqual(res.body, namedCC);
				return done();
		});
	});

	it("/api/cc", (done) => {
		request(app)
			.get("/api/cc")
			.end((err, res) => {
				if (err) return done(err);
				assert.deepStrictEqual(res.body, countryCodes);
				return done();
		});
	});

	it("/api/put-new with correct structure", (done) => {
		request(app)
			.put("/api/put-new")
			.send({
				ident: "ident1",
				records: {
					"GB": "Message 1"
				}
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				return done();
			});
	});

	it("/api/put-new put exists phrase", (done) => {
		request(app)
			.put("/api/put-new")
			.send({
				ident: "ident1",
				records: {
					"AL": "Message AL"
				}
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/put-new with non-correct structure", (done) => {
		request(app)
			.put("/api/put-new")
			.send({
				ident: "ident1",
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/put-new with non-correct ident", (done) => {
		request(app)
			.put("/api/put-new")
			.send({
				ident: "ident 2",
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/record/:ident get by ident", (done) => {
		request(app)
			.get("/api/record/ident1")
			.end((err, res) => {
				if (err) return done(err);
				assert.deepStrictEqual(res.body, {...FsService.emptyFileContent, GB: "Message 1"});
				return done();
			});
	});

	it("/api/record/:ident get by ident with filters", (done) => {
		request(app)
			.get("/api/record/ident1?filter=GB,AL")
			.end((err, res) => {
				if (err) return done(err);
				assert.deepStrictEqual(res.body, {GB: "Message 1", AL: ""});
				return done();
			});
	});

	it("/api/record/:ident get by ident with countryCode", (done) => {
		request(app)
			.get("/api/record/ident1?countryCode=GB")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.text, "Message 1");
				return done();
			});
	});

	it("/api/record/:ident non-correct ident", (done) => {
		request(app)
			.get("/api/record/ident(1")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/record/:ident non-exists ident", (done) => {
		request(app)
			.get("/api/record/ident.3")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/update-records update exists ident", (done) => {
		request(app)
			.post("/api/update-records")
			.send({
				ident: "ident1",
				records: {
					"GB": "Updated message"
				}
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				return done();
			});
	});

	it("/api/record/:ident after /api/update-records", (done) => {
		request(app)
			.get("/api/record/ident1")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				assert.deepStrictEqual(res.body, {...FsService.emptyFileContent, GB: "Updated message"});
				return done();
			});
	});

	it("/api/update-records update non-exists ident", (done) => {
		request(app)
			.post("/api/update-records")
			.send({
				ident: "ident.3",
				records: {
					"GB": "Updated message"
				}
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/update-records update with non-correct body structure", (done) => {
		request(app)
			.post("/api/update-records")
			.send({
				ident: "ident1",
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/update-records update with non-correct ident", (done) => {
		request(app)
			.post("/api/update-records")
			.send({
				ident: "ident(1",
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/update-record update one translate", (done) => {
		request(app)
			.post("/api/update-record")
			.send({
				ident: "ident1",
				countryCode: "GB",
				value: "Updated message 1"
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				return done();
			});
	});

	it("/api/record/:ident after /api/update-record", (done) => {
		request(app)
			.get("/api/record/ident1")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				assert.deepStrictEqual(res.body, {...FsService.emptyFileContent, GB: "Updated message 1"});
				return done();
			});
	});

	it("/api/update-record update one translate with non-correct body structure", (done) => {
		request(app)
			.post("/api/update-record")
			.send({
				ident: "ident1",
				value: "Updated message 1"
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/update-record update one translate with non-correct ident", (done) => {
		request(app)
			.post("/api/update-record")
			.send({
				ident: "ident(1",
				countryCode: "GB",
				value: "Updated message 1"
			})
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 400);
				return done();
			});
	});

	it("/api/all get all", (done) => {
		request(app)
			.get("/api/all")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				assert.strictEqual(res.body.hasOwnProperty("timestamp-i18n-tool"), true);
				delete res.body["timestamp-i18n-tool"];
				assert.deepStrictEqual(res.body, {ident1: {...FsService.emptyFileContent, GB: "Updated message 1"}})
				return done();
			});
	});

	it("/api/all get all with query filter", (done) => {
		request(app)
			.get("/api/all?filter=GB")
			.end((err, res) => {
				if (err) return done(err);
				assert.strictEqual(res.status, 200);
				assert.strictEqual(res.body.hasOwnProperty("timestamp-i18n-tool"), true);
				delete res.body["timestamp-i18n-tool"];
				assert.deepStrictEqual(res.body, {ident1: {GB: "Updated message 1"}})
				return done();
			});
	});

});

after(() => {
	rmdirSync(join(__dirname, "../../data"), {recursive: true});
});
