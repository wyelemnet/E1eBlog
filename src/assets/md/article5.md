## vue的生命周期钩子

- beforeCreate<br>
  &emsp;vue 实例刚初始化的时候,还没有进行数据观测及`event/wathcer`事件配置(无法访问`data, methods, watcher`等,但是可以访问`$router`及`$route`)
- created<br>
  &emsp;实例初始化完成,此时能够访问`data, methods, watcher`,可以在此钩子函数发送请求,改变数据,此时还未挂载`DOM`,无法访问`$el`
- beforeMount<br>
  &emsp;`DOM`挂载前调用,`render`函数被首次调用,生成`virtual-DOM`,无法访问`$el`
- mounted<br>
  &emsp;`DOM`挂载完成,生成`$el`并替换`el`,此时可以进行依赖`DOM`的操作,可以访问`$el`
- beforeUpdate<br>
  &emsp;数据更新后调用,此时可以进一步更改数据,并不会触发重渲染
- updated<br>
  &emsp;`virtual-DOM`重新渲染和打补丁后调用,组件 DOM 已经更新
- beforeDestroy<br>
  &emsp;实例销毁前调用,此时实例完全可用,可以清除定时器
- destroy<br>
  &emsp;实例销毁后调用,此时也可以清除定时器
- activated<br>
  &emsp;被`keep-alive`缓存的组件激活时调用,可以在此时对组件中的数据进行更新
- deactivated<br>
  &emsp;被`keep-alive`缓存的组件停用时调用
- errorCaptured<br>
  &emsp;捕获到子组件错误时调用,会收到三个参数: 错误对象, 出错的组件实例, 包含错误来源信息的字符串,可以返回`false`以阻止错误继续向上传递

### 面试题: 父组件和子组件初次渲染时,父,子组件生命周期调用顺序是什么?

- $parent: beforeCreate
- $parent: created
- $parent: beforeMount(此时父组件`虚拟DOM`已经渲染好,需要挂载`真实DOM`,所以此时去加载子组件)
- $children: beforeCreate
- $children: created
- $children: beforeMount
- $children: mounted(子组件生成真实 DOM 后,父组件挂载完成,父组件`mounted`钩子触发)
- $parent: mounted
