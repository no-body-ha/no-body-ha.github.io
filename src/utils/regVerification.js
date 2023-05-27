export function vaildMail(str) {
  const reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/
  return reg.test(str)
}
export function vaildPwd(str) {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$]{8,}/
  return reg.test(str)
}