import request from '@/utils/request'

export const fileUploadUrl = process.env.VUE_APP_BASE_API + '/file/upload'

/**
 * 文件删除
 * @param url
 * @returns {AxiosPromise}
 */
export function deleteFile(url) {
  return request({
    url: '/file/delete',
    method: 'delete',
    data: {
      url
    }
  })
}
