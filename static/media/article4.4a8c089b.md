## css垂直水平居中

- position + margin
- position + transform
- flex
- flex + margin
- grid

**position + margin(记得父级开启相对定位)**

- 不确定宽高

```
position: absolute;
top: 50%;
left: 50%;
margin-top: -width/2;
margin-left: -width/2;
```

- 不确定宽高

```
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
margin: auto;
```

**position + transform(记得父级开启相对定位)**

```
position: absolute;
top: 50%;
left: 50%;
transform: translate3d(-50%, -50%, 0)
```

**flex(设置父级元素)**

```
display: flex;
justify-content: center;
align-items: center;
```

**flex + margin**

```
.wrapper { // 父级
    display: flex;
}
.item {
    margin: auto;
}
```

**grid**

```
.wrapper {
    display: grid;
}
.item {
    align-self: center;
    justify-self: center;
}
```
