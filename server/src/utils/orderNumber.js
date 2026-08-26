function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DD${Date.now().toString().slice(-7)}${rand}`;
}

module.exports = { generateOrderNumber };
