## 输入一个 URL 然后回车，发生了什么

**很经典的一道题，能力有限，只能进行简单总结**

- 1、DNS 解析
- 2、TCP 连接，TCP 三次握手，
- 3、发送 HTTP 请求
- 4、服务器根据请求返回响应报文
- 5、客户端根据返回的数据渲染页面
- 6、TCP 四次挥手，断开连接

**DNS 解析：将域名解析成 IP 地址**<br>
依次在客户端 => 本地系统 => 路由器中找缓存，如果没有去各个域名服务器查找<br><br>
**TCP 三次握手：同步客户端与服务器端的确认号及序列号，交换窗口大小信息**<br>
a.第一次握手，由客户端发起，告知服务器将要发送请求<br>
b.第二次握手，由服务器发起，告知客户端已经准备好接收请求<br>
c.第三次握手，有客户端发起，告知服务器准备发送请求<br><br>
**渲染页面**<br>
a.根据 HTML 构建 DOM 树<br>
b.根据 CSS 构建 CSS 规则树<br>
c.根据 DOM 树及 CSS 规则树构建渲染树<br>
d.根据渲染树计算各个节点信息<br>
e.根据各个节点的信息渲染页面<br><br>
**TCP 四次挥手**<br>
a.第一次挥手，由客户端发起，告知服务器请求已经发送完毕，让服务器准备关闭<br>
b.第二次挥手，由服务器发起，告知客户端请求已经接收完毕，准备关闭<br>
c.第三次挥手，由服务器发起，告知客户端响应报文已经发送完毕，让客户端准备关闭<br>
d.第四次挥手，由客户端发起，告知服务器响应报文已经接收完毕，服务器接收到客户端信息后马上关闭，客户端等待一段时间后关闭<br><br>
**总结得过于粗糙，之后对 TCP 三次握手、四次挥手以及 HTTP 相关进行详细总结**
