/**
 * 手机号码
 * /^1[3-9]\d{9}$/
 */
export const usePhoneReg = /^1[3-9]\d{9}$/

/**
 * 数字/价格（千分位）
 * /^-?\d+(,\d{3})*(\.\d{1,2})?$/
 */
export const usePriceReg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/

/**
 * 身份证号码
 * /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
 */
export const useIdCardReg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/

/**
 * 数字
 * /^\d+$/
 */
export const useNumberReg = /^\d+$/

/**
 * 数字带小数点
 * /^-?\d+(\.\d+)?$/
 */
export const useNumberDotReg = /^-?\d+(\.\d+)?$/

/**
 * 图片文件url
 * /^(.*)\.(gif|jpg|jpeg|png)$/
 */
export const imageUrlReg = /^(.*)\.(gif|jpg|jpeg|png)$/

/**
 * 视频文件url
 * /^(.*)\.(mp4|rmvb|wmv|3gp|avi|flv)$/
 */
export const videoUrlReg = /^(.*)\.(mp4|rmvb|wmv|3gp|avi|flv)$/
