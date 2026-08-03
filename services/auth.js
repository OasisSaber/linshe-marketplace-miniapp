// Demo 认证契约：不发送真实验证码，不进行真实身份核验。
const DEMO_VERIFICATION_CODE = "123456";
const CAMPUS_DOMAIN_SUFFIXES = [".edu", ".edu.cn"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;

function getAuthState(app) {
  return {
    isVerified: Boolean(app.globalData.isVerified),
    userId: app.globalData.userId || "buyer_001",
    sellerId: app.globalData.sellerId || "seller_001",
    campus: app.globalData.campus || "北京大学"
  };
}

function verifyStudent(app, payload) {
  const source = payload || {};
  const email = String(source.email || "").trim();
  const code = String(source.code == null ? "" : source.code).trim();

  if (!EMAIL_PATTERN.test(email)) {
    return {
      ok: false,
      message: "请输入完整的校园邮箱地址",
      error: {
        code: "AUTH_EMAIL_INVALID",
        message: "请输入完整的校园邮箱地址",
        details: { field: "email" }
      }
    };
  }

  const domain = email.split("@")[1].toLowerCase();
  const isCampusDomain = CAMPUS_DOMAIN_SUFFIXES.some((suffix) => domain.endsWith(suffix));
  if (!isCampusDomain) {
    return {
      ok: false,
      message: "请输入 .edu 或 .edu.cn 校园邮箱",
      error: {
        code: "AUTH_DOMAIN_INVALID",
        message: "请输入 .edu 或 .edu.cn 校园邮箱",
        details: { field: "email" }
      }
    };
  }

  if (!CODE_PATTERN.test(code)) {
    return {
      ok: false,
      message: "验证码须为 6 位数字",
      error: {
        code: "AUTH_CODE_FORMAT_INVALID",
        message: "验证码须为 6 位数字",
        details: { field: "code" }
      }
    };
  }

  if (code !== DEMO_VERIFICATION_CODE) {
    return {
      ok: false,
      message: "验证码不正确（演示验证码为 123456）",
      error: {
        code: "AUTH_CODE_INVALID",
        message: "验证码不正确（演示验证码为 123456）",
        details: { field: "code" }
      }
    };
  }

  app.globalData.isVerified = true;
  app.globalData.userId = app.globalData.userId || "buyer_001";
  app.globalData.sellerId = app.globalData.sellerId || "seller_001";
  app.globalData.campus = app.globalData.campus || "北京大学";

  return {
    ok: true,
    message: "认证完成",
    data: getAuthState(app)
  };
}

function requireVerified(app) {
  if (app.globalData.isVerified) {
    return { ok: true, data: getAuthState(app) };
  }

  return {
    ok: false,
    message: "请先完成学生认证",
    error: {
      code: "AUTH_REQUIRED",
      message: "请先完成学生认证",
      details: {}
    },
    redirect: "/pages/auth/login"
  };
}

module.exports = {
  getAuthState,
  verifyStudent,
  requireVerified,
  DEMO_VERIFICATION_CODE
};
