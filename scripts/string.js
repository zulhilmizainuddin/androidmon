module.exports = String.prototype.removeAllNewlines = function () {
  return this.replace(/\r?\n|\r/g, "");
};
