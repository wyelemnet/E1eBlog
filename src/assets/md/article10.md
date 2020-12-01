## js 中 this 指向总结

### 普通函数: this 指向最后调用该函数的对象

- 直接的函数调用

```
window.name = 'window'
const foo = function() {
    const name = 'foo'
    console.log(this.name)
}
foo(); // 'window' 调用foo函数的是window, 所以this指向window对象
```

- 通过对象调用函数

```
window.name = 'window'
const obj = {
    name: 'object',
    foo: function() {
      console.log(this.name)
    },
};

obj.foo() // 'object' 调用foo()的是obj, 所以this是obj

const bar = obj.foo
bar() // 'window' 上一步并没有调用函数, 这一步函数才被window调用, 所以this是window
```

- `new`调用构造函数

```
window.name = 'window'
function Foo(name) {
    this.name = name
    console.log(this)
}
const foo = new Foo('foo') // Foo {name: "foo"}, 指向新创建的实例对象
```

- 定时器, 如 setTimeout

```
window.name = 'window'
const obj = {
    name: 'object',
    foo: function() {
        setTimeout(function() {
             console.log(this.name)
        }, 1000)
    },
};

obj.foo() // 'window' setTimeout(setInterval)执行的代码是运行在与所在函数完全分离的执行环境上,所以其中的this都是指向window
```

### 箭头函数: this 指向函数声明时此函数所处作用域中的 this

- 通过对象调用函数

```
window.name = 'window'
const obj1 = {
    name: 'object',
    foo: function() {
      console.log(this.name)
    },
};

const obj2 = {
    name: 'object',
    foo: () => {
      console.log(this.name)
    },
};

obj1.foo() // 'object' 普通函数, 调用函数的是obj1, 输出'object'
obj2.foo() // 'window' 箭头函数, 声明函数时, 函数所在作用域中this为window

```

- 定时器, 如`setTimeout`

```
window.name = 'window'
const obj = {
    name: 'object',
    foo: function() {
        console.log(this)
        setTimeout(() => {
             console.log(this.name)
        }, 1000)
    },
};

obj.foo() // 'object', 声明setTimeout函数时, 函数所在作用域中的this是obj对象
```
