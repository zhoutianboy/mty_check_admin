/**
 * ap接口基础请求地址
 */
export const baseApi = process.env.VUE_APP_BASE_API

/**
 * 文件类型
 * */
export const imageSuffixList = ['png', 'jpg', 'jpeg']
export const videoSuffixList = ['mp4', 'avi', 'flv']
export const audioSuffixList = ['mp3']
export const docSuffixList = ['doc', 'docx']
export const excelSuffixList = ['xls', 'xlsx']
export const pdfSuffixList = ['pdf']
export const imageFile = 1
export const videoFile = 2
export const audioFIle = 3
export const docFIle = 4
export const excelFIle = 5
export const pdfFIle = 6
export const otherFIle = 7

/**
 * 排序类型
 */
export const sortTypeOptions = [
  { label: '全部', value: '' },
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' }
]

/**
 * 关联类型
 */
export const linkTypeData = {
  customer: 1
}

/**
 * 状态类型
 */
export const statusTypeData = {
  normal: 1,
  forbidden: 2
}
export const statusTypeOptions = [
  { label: '正常', value: 1 },
  { label: '禁用', value: 2 }
]

/**
 * 性别类型
 */
export const genderTypeOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

/**
 * 合同状态类型
 * 1-已生成 2-部分付款 3-已完成
 */
export const contractStatusTypeOptions = [
  { label: '已生成', value: 1 },
  { label: '部分付款', value: 2 },
  { label: '已完成', value: 3 }
]
