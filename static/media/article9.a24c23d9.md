## call, apply,及 bind 的区别

### 初始测试代码

```
window.name = 'window'
const obj = {
    name: 'object',
    bar: function() {
        setTimeout(function() {
            console.log(this.name)
        }, 100)
    }
}
obj.bar() // window(由于由setTimeout执行的代码是运行在与所在函数完全分离的执行环境上,所以其中的this都是指向window)
```

### 作用:

- 改变`this`的指向(下次总结`this`的指向问题)

### 使用

- call:

```
window.name = 'window'
const obj = {
    name: 'object',
    bar: function() {
        setTimeout(function() {
            console.log(this.name)
        }.call(obj), 100)
    }
}
obj.bar() // object
```

- apply:

```
window.name = 'window'
const obj = {
    name: 'object',
    bar: function() {
        setTimeout(function() {
            console.log(this.name)
        }.apply(obj), 100)
    }
}
obj.bar() // object
```

- bind:

```
window.name = 'window'
const obj = {
    name: 'object',
    bar: function() {
        setTimeout(function(age, sex) {
            console.log(age, sex)
            console.log(this.name)
        }.bind(obj)(), 100)
    }
}
obj.bar() // object
```

### 区别

- 传参: `call`和`bind`接受的是参数列表, `apply`接受的是参数数组;

```
const obj = {
    name: 'object',
    bar: function() {
        setTimeout(function(age, sex) {
            console.log(age, sex)
        }.call(obj, 18, 'male'), 100)
    }
}
obj.bar() // 18 "male"

const obj1 = {
    name: 'object',
    bar: function() {
        setTimeout(function(age, sex) {
            console.log(age, sex)
        }.apply(obj1, [18, 'male']), 100)
    }
}
obj1.bar() // 18 "male"

const obj2 = {
    name: 'object',
    bar: function() {
        setTimeout(function(age, sex) {
            console.log(age, sex)
        }.bind(obj2, 18, 'male')(), 100)
    }
}
obj2.bar() // 18 "male"
```

- 返回值: `call`和`apply`返回的是使用调用者提供的`this`值及参数调用该函数的返回值,若该函数没有返回值则返回`undefined`; `bind`返回改变了`this`值的原函数的拷贝;
- 调用: `call`和`apply`立即自动调用函数, `bind`返回函数再手动调用;
