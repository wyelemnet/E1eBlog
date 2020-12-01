## 数组去重

```
const arr1 = [0, 0, '0', '0', 1, 1, '1', '1', undefined, undefined, 'undefined', 'undefined', null, null, 'null', 'null', NaN, NaN, true, true, 'true', 'true', false, false, 'false', 'false', Symbol(1), Symbol(1), 1n, 1n, {a: 1}, {a: 1}, [1], [1]]
const arr2 = [0, 0, '0', '0', 1, 1, '1', '1', undefined, undefined, 'undefined', 'undefined', null, null, 'null', 'null', NaN, NaN, true, true, 'true', 'true', false, false, 'false', 'false', Symbol(1), Symbol(1), {a: 1}, {a: 1}, [1], [1]]
```

### Set + Array.from

```
Array.from(new Set(arr1) // [0, "0", 1, "1", undefined, "undefined", null, "null", NaN, true, "true", false, "false", Symbol(1), Symbol(1), 1n, {…}, {…}, Array(1), Array(1)]

由于arr1中{}和[]都是两个不同的引用地址,所以无法去重,若是同一引用地址则可去重;Symbol(1) !== Symbol(1),不存在去重)
```

### for 循环嵌套 for 循环 1

```
遍历数组,让每一项与其他项进行比较,相同的则使用splice删除(无法去重NaN和不同引用地址的object,且会改变原数组):

const uniq = function(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        array.splice(j, 1)
        j --
      }
    }
  }
  return array
}
console.log(uniq(arr1)) // [0, "0", 1, "1", undefined, "undefined", null, "null", NaN, NaN, true, "true", false, "false", Symbol(1), Symbol(1), 1n, {…}, {…}, Array(1), Array(1)]
```

### for 循环嵌套 for 循环 2

```
准备一个空数组result,遍历原数组,让其中每一项与空数组中每一项比较,遇到相同则break跳出循环,遍历到最后push进result(无法去重NaN和不同引用地址的object, 不会改变原数组):

const uniq = function(array) {
    const result = []
    for(let i = 0; i < array.length; i ++) {
    let j = 0
        for(j; j < result.length; j ++) {
            if(array[i] === result[j]) {
                break
            }
        }
        if(j === result.length) {
            result.push(array[i])
        }
    }
    return result
}
console.log(uniq(arr1)) // [0, "0", 1, "1", undefined, "undefined", null, "null", NaN, NaN, true, "true", false, "false", Symbol(1), Symbol(1), 1n, {…}, {…}, Array(1), Array(1)]
```

### for 循环嵌套 for 循环使用 indexOf 简化

```
const uniq = function(array) {
    const result = []
    for(let i = 0; i < array.length; i ++) {
        if(result.indexOf(array[i]) === -1) {
            result.push(array[i])
        }
    }
    return result
}
console.log(uniq(arr1) // [0, "0", 1, "1", undefined, "undefined", null, "null", NaN, NaN, true, "true", false, "false", Symbol(1), Symbol(1), 1n, {…}, {…}, Array(1), Array(1)]
```

### for 循环嵌套 for 循环使用 includes 可去重 NaN

```
const uniq = function(array) {
    const result = []
    for(let i = 0; i < array.length; i ++) {
        if(!result.includes(array[i])) {
            result.push(array[i])
        }
    }
    return result
}
console.log(uniq(arr1) // [0, "0", 1, "1", undefined, "undefined", null, "null", NaN, true, "true", false, "false", Symbol(1), Symbol(1), 1n, {…}, {…}, Array(1), Array(1)]
```

### filter + indexOf:

```
indexOf返回的是找到的元素的第一个索引,遍历数组,只返回indexOf后与当前项索引相等的元素(无法去重不同引用地址的object,会直接去掉NaN,不会改变原数组)

console.log(arr1.filter((item, index, source) => source.indexOf(item) === index)) // [0, "0", 1, "1", undefined, "undefined", null, "null", true, "true", false, "false", Symbol(1), Symbol(1), 1n, {…}, {…}, Array(1), Array(1)]
```

### for 循环 + findIndex:

```
使用findIndex可以对每一项进行操作,将每一项深拷贝后再进行比较,可以去重不同引用地址的object,会直接去掉NaN和Symbol,不改变原数组)

const uniq = function(array) {
  const result = []
  for(let i = 0; i < array.length; i ++) {
      if(result.findIndex(item => JSON.stringify(item) === JSON.stringify(array[i])) === -1) {
          result.push(array[i])
      }
  }
  return result
}
console.log(uniq(arr2)) // [0, "0", 1, "1", undefined, "undefined", null, "null", true, "true", false, "false", {…}, Array(1)](JSON.stringify无法转换bigInt类型)
```
