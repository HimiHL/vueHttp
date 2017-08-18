# vueHttp API测试工具

-------

## 使用方式

> npm 

下载源码包 [GitHub地址][1] ，进入应用目录

```
cd vueHttp
npm run dev
```

浏览器访问 [http://localhost:9000][2]

> php

下载源码中的 `dist/`，运行

```
php -S localhost:9000 -t dist/
```

浏览器访问 [http://localhost:9000][2]


## 功能介绍

### 1. HTTP请求

所有 `GET`、`POST`、`PUT`、`DELETE` 的参数，均在下方的 Body 中传输

> 响应结果

响应结果分为三种显示

> * `JSON` 为格式化JSON数据后输出
> * `源码` 为HTML网页的所有代码
> * `页面` 即显示解析后的网页
> * `接口JSON` 为本次HTTP请求的JSON数据

**接口JSON** 是为自动完成HTTP请求生成一个接口的JSON文件，后面会讲到
 
### 2. 自动完成HTTP请求

你可生成一个项目的所有API接口目录，每次请求就可以免除查看文档寻找参数的繁琐事情，每当需要一个数据时候，只需要选中某个文件，程序会读取相应的JSON文件，并把参数放到相应的位置，直接点击 `请求` 就搞定了

### 3. 生成API文档

请求完成后，可点击 `生成文档` ，选中指定模板，将会把数据填充至JSON模板中，生成Markdown

`模板文件`相关查看下方 `API文档模板`

### 4. 自动替换器

自动替换器可选择 `body` `header`，会自动替换 `自动完成HTTP请求` 读取的文件中，指定请求参数的值，比如我们每次请求 `需要登录态` 的接口时，需要手动替换参数里的Token， `自动替换器` 就是为了解决这个问题；
比如我需要执行 `获取登录用户的个人资料` 和 `修改密码` 和 `修改用户个人资料` 三个操作，平常的执行流程是： 

1. 登录
2. 复制Token
3. 点击`获取登录用户的个人资料`
4. **替换Token**
5. 请求`获取登录用户的个人资料`
6. 点击`修改密码`
7. **替换Token**
8. 请求`修改密码`
9. 点击`修改个人资料`
10. **替换Token**
11. 请求`修改个人资料`

使用了 **自动替换器** 后，执行流程为：

1. 登录
2. 复制Token 
3. 打开自动替换器，输入替换Token 
4. 点击`获取登录用户的个人资料`
5. 请求`获取登录用户的个人资料`
6. 点击`修改密码`
7. 请求`修改密码`
8. 点击`修改个人资料`
9. 请求`修改个人资料`

# 文件构造

## 1. 自动完成HTTP请求JSON数据包

> * data/template.json `[项目目录列表]`

```
"demo" : # 唯一键，不可冲突
    {
        "baseMenu" : "/demo", # 当前项目的JSON文件放置目录
        "name" : "Demo", # 显示的名称
        "path" : "/demo/demo.json" # 当前项目的路由文件所在路径
    }
```

> * data/demo/demo.json `[路由文件]`

```
{
    "baseUri" : "http://localhost:8080",  # 基本网址，可在所有接口的URI前自动追加
    "menu" : [
        {
            "label" : "注册相关", # 分类名称
            "children" : [
                {
                    "label" : "注册用户", # 接口名称
                    "path" : "/regist/regist.json" # 接口文件所在位置 [相对项目文件放置目录 `demo`]
                }
            ]
        }
    ]
}
```

> * data/demo/regist/regist.json

可由每次HTTP请求的 `接口JSON` 生成

```
{
    "name" : "注册", # 暂无用处
    "uri" : "/regist", # 接口URL，将自动拼接 路由文件中的 `baseUri`
    "method" : "post", # 请求方式 get,post,put,delete
    "header" : [], # Header参数
    "contentType" : "x-www-form-urlencoded",
    "body" : [  # Body参数
        {
            "key" : "phone",
            "value" : "1300000000"
        },
        {
            "key" : "password",
            "value" : "e10adc3949ba59abbe56e057f20f883e"
        },
        {
            "key" : "code",
            "value" : ""
        }
    ]
}
```

## 2. API文档模板

> template/template.json

API文档路由配置文件

```
{
    "file": [
        "API.md" # 模板名称
    ]
}
```

> template/API.md
```

## 获取access_token

### 1) 请求地址

> {{$uri}}

### 2) 调用方式：HTTP {{$method}}

### 3) 接口描述：

* 

### 4) 请求参数:

|字段名称       |字段说明         |类型            |必填            |备注     |
| -------------|:--------------:|:--------------:|:--------------:| ------:|
{{$request}}


### 5) 请求返回结果:

{{$response}}

### 6) 请求返回结果参数说明:
|字段名称       |字段说明         |类型            |必填            |备注     |
| -------------|:--------------:|:--------------:|:--------------:| ------:|
{{$result}}

```


> * `{{$uri}}` 【替换为请求的URI】

> * `{{$request}}`【替换为请求的Body参数】

> * `{{$response}}` 【替换为请求的响应结果JSON】

> * `{{$result}}` 【替换为的响应结果列表】





  [1]: https://github.com/cxzfb/vueHttp
  [2]: http://localhost:9000