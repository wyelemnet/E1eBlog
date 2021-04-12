## let, const, var

### let 与 var 的区别<br>

- `let`不存在变量提升

  ```
  console.log(testVar) // undefined
  var testVar = 10

  console.log(testLet) // ReferenceError: testLet is not defined
  let testLet = 10
  ```

- `let`具有块级作用域

  ```
  { let testLet = 10 }
  console.log(testLet) // ReferenceError: testLet is not defined

  { var testVar = 10 }
  console.log(testVar) // 10
  ```

- 暂时性死区（temporal dead zone，简称 TDZ）：代码块内，使用`let`声明之前，该变量都是不开用的

  ```
  {
      testLet = 10 // ReferenceError: Cannot access 'testLet' before initialization
      let testLet = 20
  }

  function foo(x = y, y = 10) {
      console.log(x)
  }
  foo() // ReferenceError: Cannot access 'y' before initialization
  ```

- 同一作用域内，不允许重复声明
  ```
  let test = 10
  let test = 20 // SyntaxError: Identifier 'test' has already been declared
  ```
- `let`声明的变量不属于顶层对象(浏览器环境顶层对象是`window`, Node 中是`global`)

  ```
  var testVar = 10
  window.testVar // 10  ES5中,顶层对象的属性与全局变量挂钩

  let testLet = 10
  window.testLet // undefined  ES6中,为了保持兼容,var与function声明的全局变量依然是顶层对象的属性;let,const与class声明的全局变量不再是顶层对象的属性
  ```

## const

- 声明一个只读的变量，声明过后不能改变
  ```
  const testConst = 10
  testConst = 20 // TypeError: Assignment to constant variable.
  ```
- 使用`const`声明变量，必须立即初始化
  ```
  const testConst // SyntaxError: Missing initializer in const declaration
  ```
- 同`let`一样，`const`不存在变量提升，存在块级作用域，存在暂时性死区
