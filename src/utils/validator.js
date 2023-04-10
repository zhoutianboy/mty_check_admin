import { validPhone, validPrice } from '@/utils/validate'

export const validatePhone = (rule, value, callback) => {
  if (!validPhone(value)) {
    callback(new Error('请输入正确手机号'))
  } else {
    callback()
  }
}

export const validatePrice = (rule, value, callback) => {
  if (!validPrice(value)) {
    callback(new Error('请输入正确格式金额'))
  } else {
    callback()
  }
}
