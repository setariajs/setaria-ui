## TreeSelect 树型选择器


### 基础用法

:::demo 
```html
<template>
   <el-tree-select
      :tree-props="props"
      :options="optionData"
      v-model="value"
      :clearable="true"
    />
</template>

<script>
  export default {
    data() {
      return {
        value:1000,
       props: {
        value: 'id',
        label: 'archiveCompName',
        children: 'childs',
        // disabled:true
      },
      optionData: [
          {
            id: 1000,
            archiveCompName: 'vxe-table 从入门到放弃1',
            archiveDeptCode: 'mp3',
            size: 1024,
            archiveDeptId: '2020-08-01',
          },
          {
            id: 1005,
            archiveCompName: 'Test2',
            archiveDeptCode: 'mp4',
            size: null,
            archiveDeptId: '2021-04-01',
            childs: [
              {
                id: 24300,
                archiveCompName: 'Test3',
                archiveDeptCode: 'avi',
                size: 1024,
                archiveDeptId: '2020-03-01',
              },
              {
                id: 20045,
                archiveCompName: 'vxe-table 从入门到放弃4',
                archiveDeptCode: 'html',
                size: 600,
                archiveDeptId: '2021-04-01',
              },
              {
                id: 10053,
                archiveCompName: 'vxe-table 从入门到放弃96',
                archiveDeptCode: 'avi',
                size: null,
                archiveDeptId: '2021-04-01',
                childs: [
                  {
                    id: 24330,
                    archiveCompName: 'vxe-table 从入门到放弃5',
                    archiveDeptCode: 'txt',
                    size: 25,
                    archiveDeptId: '2021-10-01',
                  },
                  {
                    id: 21011,
                    archiveCompName: 'Test6',
                    archiveDeptCode: 'pdf',
                    size: 512,
                    archiveDeptId: '2020-01-01',
                  },
                  {
                    id: 22200,
                    archiveCompName: 'Test7',
                    archiveDeptCode: 'js',
                    size: 1024,
                    archiveDeptId: '2021-06-01',
                  },
                ],
              },
            ],
          },
          {
            id: 23666,
            archiveCompName: 'Test8',
            archiveDeptCode: 'xlsx',
            size: 2048,
            archiveDeptId: '2020-11-01',
          },
          {
            id: 24555,
            archiveCompName: 'vxe-table 从入门到放弃9',
            archiveDeptCode: 'avi',
            size: 224,
            archiveDeptId: '2020-10-01',
          },
        ]
      }
    }
  }
</script>
```
:::

### 多选用法

可使用`collapse-tags`来折叠tag

:::demo 
```html
<template>
   <el-tree-select
      :multiple="true"
      :tree-props="props"
      :options="optionData"
      v-model="value"
      :clearable="true"
    />
     <el-tree-select
      :multiple="true"
      :collapse-tags="true"
      :tree-props="props"
      :options="optionData"
      v-model="value"
      :clearable="true"
    />
</template>

<script>
  export default {
    data() {
      return {
        value: [1000],
        props: {
        value: 'id',
        label: 'archiveCompName',
        children: 'childs',
        // disabled:true
      },
      optionData: [
          {
            id: 1000,
            archiveCompName: 'vxe-table 从入门到放弃1',
            archiveDeptCode: 'mp3',
            size: 1024,
            archiveDeptId: '2020-08-01',
          },
          {
            id: 1005,
            archiveCompName: 'Test2',
            archiveDeptCode: 'mp4',
            size: null,
            archiveDeptId: '2021-04-01',
            childs: [
              {
                id: 24300,
                archiveCompName: 'Test3',
                archiveDeptCode: 'avi',
                size: 1024,
                archiveDeptId: '2020-03-01',
              },
              {
                id: 20045,
                archiveCompName: 'vxe-table 从入门到放弃4',
                archiveDeptCode: 'html',
                size: 600,
                archiveDeptId: '2021-04-01',
              },
              {
                id: 10053,
                archiveCompName: 'vxe-table 从入门到放弃96',
                archiveDeptCode: 'avi',
                size: null,
                archiveDeptId: '2021-04-01',
                childs: [
                  {
                    id: 24330,
                    archiveCompName: 'vxe-table 从入门到放弃5',
                    archiveDeptCode: 'txt',
                    size: 25,
                    archiveDeptId: '2021-10-01',
                  },
                  {
                    id: 21011,
                    archiveCompName: 'Test6',
                    archiveDeptCode: 'pdf',
                    size: 512,
                    archiveDeptId: '2020-01-01',
                  },
                  {
                    id: 22200,
                    archiveCompName: 'Test7',
                    archiveDeptCode: 'js',
                    size: 1024,
                    archiveDeptId: '2021-06-01',
                  },
                ],
              },
            ],
          },
          {
            id: 23666,
            archiveCompName: 'Test8',
            archiveDeptCode: 'xlsx',
            size: 2048,
            archiveDeptId: '2020-11-01',
          },
          {
            id: 24555,
            archiveCompName: 'vxe-table 从入门到放弃9',
            archiveDeptCode: 'avi',
            size: 224,
            archiveDeptId: '2020-10-01',
          },
        ]
      }
    }
  }
</script>
```
:::


###  Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value / v-model | 绑定值 | boolean / string / number / array | — | — |
| multiple | 是否多选 | boolean | — | false |
| options | 下拉树中的数据 | Array | — | — |
| size | 输入框尺寸 | string | medium/small/mini | — |
| clearable | 是否可以清空选项 | boolean | — | false |
| tree-props | options属性的key | Object | — | 详情看下表|


###  treeProps 属性说明
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value | 绑定value的key |  string  | — | value |
| label | 绑定label的key |  string  | — | label |
| children | 绑定子元素的key | Array | — | children |
