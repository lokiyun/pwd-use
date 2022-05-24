import jsMD5 from 'js-md5'

export const getMD5 = (str: string) => {
  return jsMD5(str)
}
