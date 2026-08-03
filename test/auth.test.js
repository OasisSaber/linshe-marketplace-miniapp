const test = require("node:test");
const assert = require("node:assert/strict");
const auth = require("../services/auth");

function freshApp() {
  return {
    globalData: { isVerified: false, userId: "buyer_test", campus: "北京大学" }
  };
}

test("accepts a complete campus email with the demo code", () => {
  const app = freshApp();
  const result = auth.verifyStudent(app, { email: "student@pku.edu.cn", code: "123456" });
  assert.equal(result.ok, true);
  assert.equal(app.globalData.isVerified, true);
});

test("accepts any .edu domain suffix email", () => {
  for (const email of ["student@example.edu", "a@b.edu.cn"]) {
    const app = freshApp();
    const result = auth.verifyStudent(app, { email, code: "123456" });
    assert.equal(result.ok, true, `should accept ${email}`);
  }
});

test("rejects incomplete email addresses", () => {
  const emails = ["abc.edu", "student@", "@pku.edu.cn", "a b@pku.edu.cn", "student@pku", ""];
  for (const email of emails) {
    const app = freshApp();
    const result = auth.verifyStudent(app, { email, code: "123456" });
    assert.equal(result.ok, false, `should reject ${JSON.stringify(email)}`);
    assert.equal(app.globalData.isVerified, false, `state unchanged for ${JSON.stringify(email)}`);
  }
});

test("rejects non-campus domains", () => {
  const emails = ["student@example.com", "student@qq.cn", "student@gmail.edu.cn.evil.com"];
  for (const email of emails) {
    const app = freshApp();
    const result = auth.verifyStudent(app, { email, code: "123456" });
    assert.equal(result.ok, false, `should reject ${email}`);
    assert.equal(app.globalData.isVerified, false);
  }
});

test("requires a six-digit numeric code", () => {
  const codes = ["", "12345", "1234567", "abcdef", "12 456", "12345a"];
  for (const code of codes) {
    const app = freshApp();
    const result = auth.verifyStudent(app, { email: "student@pku.edu.cn", code });
    assert.equal(result.ok, false, `should reject code ${JSON.stringify(code)}`);
    assert.equal(app.globalData.isVerified, false);
  }
});

test("rejects a wrong six-digit code without changing state", () => {
  const app = freshApp();
  const result = auth.verifyStudent(app, { email: "student@pku.edu.cn", code: "654321" });
  assert.equal(result.ok, false);
  assert.equal(app.globalData.isVerified, false);
});

test("invalid input after a failed attempt still requires a valid attempt", () => {
  const app = freshApp();
  auth.verifyStudent(app, { email: "student@pku.edu.cn", code: "000000" });
  assert.equal(app.globalData.isVerified, false);
  const ok = auth.verifyStudent(app, { email: "student@pku.edu.cn", code: "123456" });
  assert.equal(ok.ok, true);
  assert.equal(app.globalData.isVerified, true);
});

test("exports the documented demo verification code", () => {
  assert.equal(auth.DEMO_VERIFICATION_CODE, "123456");
});
