## three.js 读取服务器上的模型文件流并加载模型

### desc

模型预览功能: 大概为读取模型接口获得对应文件流, 然后加载模型

### use

使用[zip.js](http://gildas-lormeau.github.io/zip.js/)读取流;

使用[URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL)创建读取后的流文件 url;

使用[three.js](https://threejs.org/)加载模型;

### working

```
three.js的FileLoader读取到模型文件的流:
  	const fileLoader = new THREE.FileLoader();
    fileLoader
        .setResponseType("arraybuffer")
        .load(
            modelUrl,
            data => this.onModelLoad(data, scene),
        )
zip.js加载文件流生成对应文件:
    const zip = new JSZip();
    const promise = JSZip.external.Promise;
    const baseUrl = 'blob:' + THREE.LoaderUtils.extractUrlBase(modelUrl);
    const fileMap = {};
    const pendings = [];
    await zip.loadAsync(data);
URL.createObjectURL()创建文件的url:
    for (let file in zip.files) {
        const entry = zip.file(file);
        if (entry === null) continue;
        pendings.push(entry.async('blob').then((file, blob) => {
            fileMap[baseUrl + file] = URL.createObjectURL(blob);
        }.bind(this, file)));
    }
    await promise.all(pendings);
用正则找到其中的模型文件的url(因为还可能有纹理图片或者其他用于渲染的文件):
    const modelUrl = Object.keys(fileMap).find(item => reg.test(item));
    if (!modelUrl) {
        return;
    }
three.js的TDSLoader加载3ds模型(其他类型模型使用其他loader):
    const manager = new THREE.LoadingManager();
    // 修改url, 比如一个3ds模型的zip文件中, 会有纹理图片等,
       但是使用URL.createObjectURL()创建的url与原本的不对应,
       所有存储在fileMap中并在加载模型时修改url
    manager.setURLModifier((fileMap, url) => {
        return fileMap[url] ? fileMap[url] : url;
    });
    const loader = new TDSLoader(manager);
    loader.load(modelUrl, group => {
        scene.add(group)
    })
```

### problems

```
1. zip.js报错: jszip.min.js:13 Uncaught (in promise) Error: The
    constructor with parameters has been removed in JSZip 3.0, 
    please check the upgrade guide.
  3.0版本之前:
      const zip = new JSZip(data)
  3.0版本:
      const zip = new JSZip();
      zip.loadAsync.then(resp => {})
2. three.js使用的three@0.120.0版本, 加载的模型出现了透明的情况:
  可设置material的transparent为false
  及修改material的opacity
```
