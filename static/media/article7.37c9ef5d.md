## cookie,webStorage

### 保存时长

- cookie：默认保存在内存中，关闭浏览器后失效，如果设置过期时间则在过期时间后失效
- localStorage：一直生效除非主动清除
- sessionStorage：仅当前会话有效，关闭页面或浏览器后失效

### 存储大小

- cookie：4KB
- webStorage：5MB（浏览器不同可能不同）

### HTTP 请求

- cookie：会携带在 HTTP 头中，有一定的性能影响
- webStorage：仅在客户端存储

### 使用

- cookie：`document.cookie`可得到所有`cookie`
- localStorage：
  ```
  set: localStorage.setItem(key, value)
  get: localStorage.getItem(key)
  remove: localStorage.removeItem(key)
  clear: localStorage.clear() // 清除所有
  ```
- sessionStorage：
  ```
  set: sessionStorage.setItem(key, value)
  get: sessionStorage.getItem(key)
  remove: sessionStorage.removeItem(key)
  clear: sessionStorage.clear() // 清除所有
  ```
- `cookie`和`webStorage`只能存储`string`类型数据（可使用`JSON`相关`API`实现存储`object`）
