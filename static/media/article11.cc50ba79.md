## 获取对象任意深度的属性值

### 介绍

```
最近项目使用到C端导出的osgjs文件绘制模型, 类似于json文件, 所以修改文件扩展为json, 再读取文件, 获取绘制模型需要的数据;
由于每种类型模型的osgjs文件层次结构都可能不相同, 但是关键数据都是在'osg.Geometry'对象中,所以写一个获取对象任意深度属性值的方
法, 来获取数据;
```

### [修改文件后缀名可参考](https://juejin.im/post/6859658488193220616)

### 函数

```
const deepObj = (obj, key) => {
  const keys = Object.keys(obj);
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const k = keys[i];
    const v = obj[k];
    if (k === key) {
      return v;
    } else if (
      Object.prototype.toString.call(v).slice(8, -1) === 'Object'
    ) {
      const res = deepObj(v, key);
      if (res !== undefined) {
        return res;
      }
    }
  }
};
const obj = {
  a: {
    b: {
      d: 2,
    },
    c: {
      e: 1,
    },
  },
};
console.log(deepObj(obj, 'e')); // 1
```

### 改进

```
由于osgjs文件中含有数组, 所以对上面函数进行改进:
const deepObj = (obj, key) => {
  const keys = Object.keys(obj);
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const k = keys[i];
    const v = obj[k];
    if (k === key) {
      return v;
    } else if (
      Object.prototype.toString.call(v).slice(8, -1) === 'Object'
    ) {
      const res = deepObj(v, key);
      if (res !== undefined) {
        return res;
      }
    } else if (
      Object.prototype.toString.call(v).slice(8, -1) === 'Array'
    ) {
      const res = v.map(item => {
        const result = deepObj(item, key);
        if (result !== undefined) {
          return result;
        }
      });
      if (!res.some(item => item === undefined)) {
        return res;
      }
    }
  }
};
const obj = {
  a: {
    b: {
      d: 2,
    },
    c: {
      e: 1,
    },
    g: [
      {
        f: 3,
      },
      {
        f: 4,
      },
    ],
  },
};
console.log(deepObj(obj, 'f')); // [3, 4]
```

### 思考

```
若是obj中不同层级之间有多个key, 只能获取一个:
const obj = {
  a: {
    b: {
      d: 2,
    },
    c: {
      e: 1,
    },
    h: {
      f: 6,
    },
    g: [
      {
        f: 3,
      },
      {
        f: 4,
      },
    ],
  },
};
console.log(deepObj(obj, 'f')); // 6
```
