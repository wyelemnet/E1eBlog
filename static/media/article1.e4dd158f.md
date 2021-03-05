## js中判断数据类型方法

- typeof
- instanceof
- constructor(for string|number|boolean|symbol|bigint|object|array|function|symbol)
- toString()(for all)

### [typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) => 返回一个字符串，表示未经计算的操作数的类型。

**使用**: `typeof 'Ele' | type('Ele') => 'string' ` <br>
**注意**: <br>

- 可以判断`string|number|boolean|undefined|symbol|bigint|function`无法判断`null|array|object` <br>
- `typeof NaN => 'number'`
- 除了`Function`外,其他通过 new 操作符创建的,都返回`'object'`,如`typeof new Number(1) => 'object'`(`symbol`无法使用 new)

---

### [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) => 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上

**使用**: `[] instanceof Array => true`<br>
**注意**: 可用于判断是否为`array|function`

---

### constructor

**使用**: `[].constructor === Array => true` <br>
**注意**: <br>

- `null`和`undefined`会报错,其他类型都能判断
- `constructor`可被重写及覆盖

---

### [Object.prototype.toString.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) => 返回一个表示该对象的字符串

**使用**: `Object.prototype.toString.call(1) => '[object Number]'`<br>
**注意**: <br>

- slice 返回的字符串`Object.prototype.toString.call(1).slice(8, -1) => 'Number'`,根据 slice 得到的字符串进行判断
- 此方法可判断所有数据类型,推荐使用
