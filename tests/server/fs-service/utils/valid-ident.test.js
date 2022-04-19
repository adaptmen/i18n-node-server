const {validateIdent} = require("../../../../dist/fs-service/utils/valid-ident");
const assert = require("assert");


describe("validateIdent() util", () => {
	it("correct returns", () => {
		assert.strictEqual(true, validateIdent("test"));
		assert.strictEqual(true, validateIdent("test-1"));
		assert.strictEqual(true, validateIdent("test_1"));
		assert.strictEqual(true, validateIdent("_1"));
		assert.strictEqual(true, validateIdent(".1"));
		assert.strictEqual(true, validateIdent("t.1"));
		assert.strictEqual(true, validateIdent("t,1_,"));
		assert.strictEqual(true, validateIdent(",_,"));
	});
	it("non-correct returns", () => {
		assert.strictEqual(false, validateIdent("test 1"));
		assert.strictEqual(false, validateIdent("test%1"));
		assert.strictEqual(false, validateIdent("test% 1"));
		assert.strictEqual(false, validateIdent("test&^1"));
		assert.strictEqual(false, validateIdent("test(1)"));
	});
});
