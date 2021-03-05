## Cesium加载GLTF模型（模型置于zip文件）

### 壹（序）
Cesium支持加载本地gltf模型文件，但需要发布模型服务时，还必须同时发布bin文件及纹理文件；现在想要实现只发布一个zip模型文件，前端读取zip文件流后，加载模型；
### 贰（头脑风暴）
* 读取zip文件流可以使用[zip.js](http://gildas-lormeau.github.io/zip.js/)

* 使用[URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL)生成各个文件的url;

* 得到生成过后的url，再使用Cesium加载模型；
### 叁（坎坷）
* 成功读取zip文件(下为封装好的读取zip文件方法)
	```
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
    ```
 * 生成各个文件对应的url
 	```
   const entry = zip.file(file);
   entry.async('blob').then((blob) => {
      // 生成url并放进fileMap
      fileMap[file] = URL.createObjectURL(blob);
    }),
    ```
 * 加载模型文件，读取gltf文件时需要去读取bin文件及纹理文件，但是bin文件与纹理文件的url此时是`URL.createObjectURL()`生成的，无法正确读取
### 肆（终章）
* 遇到该问题时，我想到之前[使用Three.js加载文件流](https://juejin.cn/post/6867451087532769288)的经历，但是那是Three.js可以处理每一个url，Cesium不行
* 突发奇想，gltf本身是JSON类的文件，那么我是否可以将gltf文件读取未string类型，再转为JSON类型，再`修改其中需要需要的uri`，再将修改好的文件，转为[Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)，再使用`URL.createObjectURL()重新生成gltf文件的url`;
* 修改代码过后，发现方法可行
	```
    // 加载gltf文件为string类型
    const res = await gltfEntry.async('string');
    // 转化为json
    const gltfJson = JSON.parse(res);
    // 修改buffers和纹理的uri
    gltfJson.buffers.forEach((item) => {
      item.uri = fileMap[item.uri];
    });
    gltfJson.images.forEach((item) => {
      item.uri = fileMap[item.uri];
    });
    // 更新fileMap中gltf文件url
    fileMap[gltfFileName] = URL.createObjectURL(
      new Blob([JSON.stringify(gltfJson)]),
    );
    ```
* 使用Cesium加载模型
	```
    viewer.entities.add({
      name: fileMap[gltfFileName],
      position: position,
      orientation: orientation,
      model: {
        uri: fileMap[gltfFileName],
        minimumPixelSize: 128,
        maximumScale: 20000,
      },
    });
    ```
* 最终实现方法函数
	```
    loadZipFile() {
      // 读取zip文件
      const zip = await readZipFile('satellite.zip');
      // 需要读取的所有文件
      const pendings = [];
      // 文件Map，文件名对应url
      const fileMap = {};
      // zip文件中的gltf文件的entry（JSZip中读取文件的方法）
      let gltfEntry = null;
      // zip文件中gltf文件名
      let gltfFileName = '';
      // 遍历zip中的所有文件，生成fileMap
      for (let file in zip.files) {
        const entry = zip.file(file);
        if (entry === null) continue;
        if (file.includes('.gltf')) {
          gltfEntry = entry;
          gltfFileName = file;
        }
        // push需要加载的文件
        pendings.push(
          entry.async('blob').then((blob) => {
            // 生成url并放进fileMap
            fileMap[file] = URL.createObjectURL(blob);
          }),
        );
      }
      // 使用JSZip封装好的Promise
      const promise = JSZip.external.Promise;
      // 等待加载文件
      await promise.all(pendings);
      // 加载gltf文件为string类型
      const res = await gltfEntry.async('string');
      // 转化为json
      const gltfJson = JSON.parse(res);
      // 修改buffers和纹理的uri
      gltfJson.buffers.forEach((item) => {
        item.uri = fileMap[item.uri];
      });
      gltfJson.images.forEach((item) => {
        item.uri = fileMap[item.uri];
      });
      // 更新fileMap中gltf文件url
      fileMap[gltfFileName] = URL.createObjectURL(
        new Blob([JSON.stringify(gltfJson)]),
      );

      // 加载模型
      viewer.entities.removeAll();

      const position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706,
        5000,
      );
      const heading = Cesium.Math.toRadians(135);
      const pitch = 0;
      const roll = 0;
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr,
      );
      const entity = viewer.entities.add({
        name: fileMap[gltfFileName],
        position: position,
        orientation: orientation,
        model: {
          uri: fileMap[gltfFileName],
          minimumPixelSize: 128,
          maximumScale: 20000,
        },
      });
      viewer.trackedEntity = entity;
    },
    ```
### 伍（预览）
[效果预览](https://wyelemnet.github.io/E1eBlog/#/examples/cityInSky)