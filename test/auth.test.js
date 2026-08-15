const { test } = require("node:test");
const assert = require("node:assert/strict");

const auth = require("../services/auth");

function makeApp() {
  return { globalData: {} };
}

test("getAuthState returns unverified defaults", () => {
  const state = auth.getAuthState(makeApp());
  assert.equal(state.isVerified, false);
  assert.equal(state.userId, "buyer_001");
  assert.equal(state.campus, "北京大学");
});

test("getAuthState reflects verified globalData", () => {
  const app = makeApp();
  app.globalData.isVerified = true;
  app.globalData.userId = "buyer_042";
  app.globalData.campus = "清华大学";
  const state = auth.getAuthState(app);
  assert.equal(state.isVerified, true);
  assert.equal(state.userId, "buyer_042");
  assert.equal(state.campus, "清华大学");
});

test("verifyStudent rejects non-campus email", () => {
  const app = makeApp();
  const result = auth.verifyStudent(app, { email: "someone@gmail.com" });
  assert.equal(result.ok, false);
  assert.equal(result.message, "请输入校园邮箱");
  assert.equal(app.globalData.isVerified, undefined);
});

test("verifyStudent trims whitespace before checking", () => {
  const app = makeApp();
  const result = auth.verifyStudent(app, { email: "  buyer@stu.pku.edu.cn  " });
  assert.equal(result.ok, true);
  assert.equal(app.globalData.isVerified, true);
});

test("verifyStudent accepts campus email and fills defaults", () => {
  const app = makeApp();
  const result = auth.verifyStudent(app, { email: "buyer@stu.pku.edu.cn" });
  assert.equal(result.ok, true);
  assert.equal(result.message, "认证完成");
  assert.equal(app.globalData.isVerified, true);
  assert.equal(app.globalData.userId, "buyer_001");
  assert.equal(app.globalData.campus, "北京大学");
});

test("verifyStudent keeps existing userId and campus", () => {
  const app = makeApp();
  app.globalData.userId = "buyer_099";
  app.globalData.campus = "复旦大学";
  const result = auth.verifyStudent(app, { email: "buyer@fudan.edu.cn" });
  assert.equal(result.ok, true);
  assert.equal(app.globalData.userId, "buyer_099");
  assert.equal(app.globalData.campus, "复旦大学");
});

test("requireVerified redirects when unverified", () => {
  const result = auth.requireVerified(makeApp());
  assert.equal(result.ok, false);
  assert.equal(result.redirect, "/pages/auth/login");
  assert.equal(result.message, "请先完成学生认证");
});

test("requireVerified passes when verified", () => {
  const app = makeApp();
  app.globalData.isVerified = true;
  const result = auth.requireVerified(app);
  assert.equal(result.ok, true);
  assert.equal(result.redirect, undefined);
});
