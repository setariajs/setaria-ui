## Json Viewer
参考自[react-json-view](https://github.com/mac-s-g/react-json-view)

基于 *Tree组件* 通过树状结构显示指定JSON字符串的内容。

:::demo
```html
<template>
  <el-json-viewer :data="jsonData1"></el-json-viewer>
</template>
<script>
  export default {
    data() {
      return {
        jsonData1: '{"string": "this is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test stringthis is a test string","integer": 42,"obj":{\"a\": 1},"array":[{"a":"1"}, 2], "boolean": true, "null": null, "emptyobj": {}, "emptyarray": []}'
      };
    }
  };
</script>
```
:::

### Attributes

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| data  | JSON文本    | string/object   |  —  |  —  |
| collapse-string-size  | 值过长时截取的长度(-1时为不对值进行截取)    | number   |  —  |  —  |
| copy  | 是否显示值复制按钮    | boolean   |  —  | true   |