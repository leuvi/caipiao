function createBolls(max, hasBlue) {
  return hasBlue ? [...Array(max + 1)].map((v, k) => k).filter(v => v > 0).map(v => v > 9 ? String(v) : '0' + v) : [...Array(max)].map((v, k) => String(k))
}

module.exports = {
  createBolls,
}