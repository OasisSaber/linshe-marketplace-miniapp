const test = require("node:test");
const assert = require("node:assert/strict");
const auth = require("../services/auth");

function freshApp() {
  return {
    globalData: {
      isVerified: false,
      userId: "buyer_test",
      sellerId: "seller_001",
      campus: "北京大学"
    }
  };
}

test("accepts complete campus email and demo code", () => {
  const app = freshApp();
  const result = auth.verifyStudent(app, {
    email: "student@pku.edu.cn",
    code: "123456"
  });
  assert.equal(result.ok, true);
  assert.equal(app.globalData.isVerified, true);
});

test("rejects incomplete and non-campus emails", () => {
  for (const email of ["abc.edu", "student@example.com", "student@gmail.edu.cn.evil.com"]) {
    const app = freshApp();
    const result = auth.verifyStudent(app, { email, code: "123456" });
    assert.equal(result.ok, false, email);
    assert.equal(app.globalData.isVerified, false);
  }
});

test("rejects malformed and wrong codes", () => {
  for (const code of ["", "12345", "abcdef", "654321"]) {
    const app = freshApp();
    const result = auth.verifyStudent(app, {
      email: "student@pku.edu.cn",
      code
    });
    assert.equal(result.ok, false, code);
    assert.equal(app.globalData.isVerified, false);
  }
});

test("requireVerified returns redirect for unauthenticated state", () => {
  const app = freshApp();
  const result = auth.requireVerified(app);
  assert.equal(result.ok, false);
  assert.equal(result.redirect, "/pages/auth/login");
});


test("missing payload fails safely and keeps legacy message field", () => {
  const app = freshApp();
  const result = auth.verifyStudent(app);
  assert.equal(result.ok, false);
  assert.equal(typeof result.message, "string");
  assert.equal(result.message, result.error.message);
  assert.equal(app.globalData.isVerified, false);
});

test("successful result keeps legacy message field", () => {
  const app = freshApp();
  const result = auth.verifyStudent(app, {
    email: "student@pku.edu.cn",
    code: "123456"
  });
  assert.equal(result.message, "认证完成");
});
