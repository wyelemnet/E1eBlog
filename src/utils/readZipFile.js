import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

/**
 *
 * @param {string} url zip文件路径
 * @returns JSZip实例
 */
const readZipFile = (url) => {
  // 使用JSZip读取zip文件
  return new JSZip.external.Promise(function (resolve, reject) {
    // 使用JSZipUtils获取数据
    JSZipUtils.getBinaryContent(url, function (err, data) {
      // 如果读取出错
      if (err) {
        // 抛出
        reject(err);
      } else {
        // 返回数据
        resolve(data);
      }
    });
  })
    .then(function (data) {
      // 异步加载数据
      return JSZip.loadAsync(data);
    })
    .then((resp) => {
      // 返回加载好的数据
      return new Promise((resolve) => {
        resolve(resp);
      });
    });
};

export default readZipFile;
