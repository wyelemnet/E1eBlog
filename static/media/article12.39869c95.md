## Python 脚本修改文件后缀名

### 介绍

```
项目中C端导出的大量osgjs文件需要转为json文件, 想到使用Python写一个简单脚本修改;
```

### 实现

```
import os


def change_file_suffix(path, old_suffix, new_suffix):
	files = os.listdir(path) # 读取path下所有文件
    for filename in files:
        portion = os.path.splittext(filename) # 分割文件名
        if portion[1] == '.' + old_suffix:
            new_name = portion[0] + '.' + new_suffix
            os.rename(filename, new_name) # 重命名


path = './' # 需要转化的文件路径
old_suffix = 'osgjs' # 需要转化的文件类型
new_suffix = 'json' # 转化之后的文件类型
change_file_suffix(path, old_suffix, new_suffix)
```
