const isHEX = (ch) => "0123456789abcdef".includes(ch.toLowerCase())

module.exports = {
  isGuidValid: (guid) => {
    guid = guid.replaceAll("-", "")
    return guid.length === 32 && [...guid].every(isHEX)
  },
}
