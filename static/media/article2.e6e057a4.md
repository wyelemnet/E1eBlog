## 一道经典面试题

```
function Foo() {
    showAlert = function() { alert(1) }
    return this
}
Foo.showAlert = function() { alert(2) }
Foo.prototype.showAlert = function() { alert(3) }
var showAlert = function() { alert(4) }
function showAlert() { alert(5) }

// run
Foo.showAlert()
showAlert()
Foo().showAlert()
showAlert()
new Foo.showAlert()
new Foo().showAlert()
new new Foo().showAlert()
```

### 执行

- `var`的变量以及`function`会进行变量提升，此时全局下有函数`Foo`及`showAlert => 5`
- `Foo`添加属性`showAlert => 2`，`Foo`的`prototype`添加属性`showAlert => 3`
- 赋值全局下`showAlert => 4`，覆盖`showAlert => 5`

### 输出

- `Foo.showAlert():` 执行`Foo`的`showAlert => 2`，输出 **2**
- `showAlert():` 执行全局下的`showAlert()`，由于`showAlert => 5`已经被`showAlert => 4`覆盖，所以输出 **4**
- `Foo().showAlert():` 执行`Foo`函数后调用`showAlert()`，执行`Foo`的`showAlert = function() { alert(1) }`，由于`Foo`函数自身没有`showAlert`，所以找到上级（window），覆盖掉全局的`showAlert => 4`，变为`showAlert => 1`，`Foo()`返回的`this`为`window`,所以调用全局的`showAlert`，输出 **1**
- `showAlert():` 再次调用全局下`showAlert`，此时全局下为`showAlert => 1`，输出 **1**
- `new Foo.showAlert()`和`new Foo().showAlert()`: 由于成员访问(.)优先级为**19**，`new Foo()`优先级为**19**（优先级一样时从左到右），`new Foo`优先级为**18**，所以`new Foo.showAlert()`先执行`Foo.showAlert()`，得到`showAlert => 2`，再进行`new`，输出 **2**；`new Foo().showAlert()`先执行`new Foo()`，得到`Foo`的对象,再通过原型链找到`showAlert`，最后得到`showAlert => 3`，输出 **3**<br> [查看 js 运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
- `new new Foo().showAlert():` 再`new`一次`showAlert => 3`，输出 **3**
- 最终输出结果为 **2 4 1 1 2 3 3**
- **注意：** [alert(message)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/alert)中`message`将转换为字符串，所以结果为：`'2', '4', '1', '1', '2', '3', '3'`
