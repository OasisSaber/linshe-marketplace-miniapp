let sequence = 0;

function createId(prefix) {
  sequence += 1;
  const time = Date.now().toString(36);
  const counter = sequence.toString(36).padStart(3, "0");
  return `${prefix}_${time}_${counter}`;
}

function resetIds() {
  sequence = 0;
}

module.exports = {
  createId,
  resetIds
};
