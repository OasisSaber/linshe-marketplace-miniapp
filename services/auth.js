// Demo 认证契约（本地流程演示，不发送真实验证码，不进行真实身份核验）：
// - 邮箱必须是完整 email 地址，且域名以 .edu 或 .edu.cn 结尾；
// - 验证码必须是 6 位数字，演示验证码固定为 123456。
const DEMO_VERIFICATION_CODE = "123456";
const CAMPUS_DOMAIN_SUFFIXES = [".edu", ".edu.cn"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;

function getAuthState(app) {
  return {
    isVerified: Boolean(app.globalData.isVerified),
    userId: app.globalData.userId || "buyer_001",
    campus: app.globalData.campus || "北京大学"
  };
}

function verifyStudent(app, payload) {
  const email = (payload.email || "").trim();
  const code = String(payload.code == null ? "" : payload.code).trim();

  if (!EMAIL_PATTERN.test(email)) {
    return {
      ok: false,
      message: "请输入完整的校园邮箱地址"
    };
  }
  const domain = email.split("@")[1].toLowerCase();
  const isCampusDomain = CAMPUS_DOMAIN_SUFFIXES.some((suffix) => domain.endsWith(suffix));
  if (!isCampusDomain) {
    return {
      ok: false,
      message: "请输入 .edu 或 .edu.cn 校园邮箱（如 student@pku.edu.cn）"
    };
  }
  if (!CODE_PATTERN.test(code)) {
    return {
      ok: false,
      message: "验证码须为 6 位数字"
    };
  }
  if (code !== DEMO_VERIFICATION_CODE) {
    return {
      ok: false,
      message: "验证码不正确（演示验证码为 123456）"
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
  requireVerified,
  DEMO_VERIFICATION_CODE
};
