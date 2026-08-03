function success(data) {
  return { ok: true, data };
}

function failure(code, message, details) {
  return {
    ok: false,
    error: {
      code,
      message,
      details: details || {}
    }
  };
}

module.exports = {
  success,
  failure
};
