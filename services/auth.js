function getAuthState(app) {
  return {
    isVerified: Boolean(app.globalData.isVerified),
    userId: app.globalData.userId || "buyer_001",
    campus: app.globalData.campus || "北京大学"
  };
}

function verifyStudent(app, payload) {
  const email = (payload.email || "").trim();
  if (!email.includes(".edu")) {
    return {
      ok: false,
      message: "请输入校园邮箱"
    };
  }

  app.globalData.isVerified = true;
  app.globalData.userId = app.globalData.userId || "buyer_001";
  app.globalData.campus = app.globalData.campus || "北京大学";

  return {
    ok: true,
    message: "认证完成"
  };
}

function requireVerified(app) {
  if (app.globalData.isVerified) {
    return { ok: true };
  }

  return {
    ok: false,
    redirect: "/pages/auth/login",
    message: "请先完成学生认证"
  };
}

module.exports = {
  getAuthState,
  verifyStudent,
  requireVerified
};
