## 世界坐标转换为 WebGL[-1,1]坐标

### 原理

* 各个点的坐标减去 x0, y0 坐标, 平移到(0,0)处
* 各个点的坐标除以宽高, 占据第一象限(0,1)
* 各个点的坐标诚 2, 再减去 1, 铺满[-1,1]坐标

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0672fef5ffa744cdbf721d8f2423d5c8~tplv-k3u1fbpfcp-zoom-1.image)

### 实现(只实现 2 维, 3 维处理 z 轴即可)

1. 顶点着色器实现

```
attribute vec2 a_Position; // 顶点的x,y坐标
uniform float u_WidthDiff; // x轴上的宽度差值
uniform float u_HeightDiff; // y轴上的高度差值
uniform float u_X0; // x0
uniform float u_Y0; // y0
void main() {
	float XPosition = (a_Position.x - u_WidthDiff) // u_WidthDiff * 2 - 1.0; // 处理x轴
    float YPosition = (a_Position.y - u_HeightDiff) // u_HeightDiff * 2 - 1.0; // 处理y轴
    gl_Position = vec4(XPosition, YPosition, 0.0, 1.0);
}
```

2. 处理坐标点实现

```
...// vertexes: 顶点坐标数组(左下到右上)
const minX = vertexes[0];
const maxX = vertexes[vertexes.length - 2];
const minY = vertexes[1];
const maxY = vertexes[vertexes.length - 1];
const newVertexes = vertexes.map((item, index) => {
	if (index % 2 === 0) {
    	return (item - minX) / (maxX - minX) * 2 - 1;
    } else {
    	return (item - minY) / (maxY - minY) * 2 - 1;
    }
}
```
