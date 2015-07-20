# mat-componenttmpl

[![npm version](https://badge.fury.io/js/mat-componenttmpl.svg)](http://badge.fury.io/js/mat-componenttmpl)

用来处理brix的模版文件的打包,会自动去匹配`/@TEMPLATE\|(.*?)\|TEMPLATE@/g`对应的文件地址，进行替换。

## Installation

```sh
npm install --save mat-componenttmpl
```

## Usage

```javascript
var mat  = require('mat')
var componenttmpl = require('mat-componenttmpl')
var rewrite = require('mat-rewrite')

mat.task('daily', function () {
  mat.url([/\.js/])
    .use(componenttmpl())
})
```