## 更新日志

### 1.6.0
*2021-07-22*
#### 新特性

- Skeleton
  - 新增 Skeleton 组件 (#21038 by @cs1707)
- Empty
  - 新增 Empty 组件 (#21080 by @cs1707)
#### Bug 修复

- Calendar 
  - 修复 calendar 国际化 bug (#20758 by @iamkun)
  - 修复 first-day-of-week (#21057 by @cs1707)
- Carousel
  - 修复 interval 和 scale bug (#20931 by @cs1707)
- Cascader
  - 修复 cascader panel active path (#20730 by @cs1707)
  - 修复 delete tag bug (#20939 by @cs1707)
- ColorPicker
  - 修复 bugs (by @UxieVerity)
- Drawer
  - 修复 Drawer bug (by @cs1707)
  - 修复 focus bug (#20626 by @cs1707)
  - 支持 overflow auto (#20948 by @cs1707)
  - 修复 destroy (#20715 by @zj9495)
- Image
  - 图片预览优化 (#20652 by @cs1707)
  - 修复 image object fit ratio 在 IE 下的 bug  (#19583 by @charlie0228)
  - 修复 z-index 增加 keydown 事件 添加 stopPropagation (#20859 by @cs1707)
- Input
  - 修复 password cursor 展示 (#20870 by @cs1707)
  - 修复 password icon 在 edge 下的展示 (#20902 by @cs1707)
- Popconfirm
  - 修复 Popconfirm 国际化 bug by @iamkun
- Row
  - 修复 align top (#20963 by @cs1707)
- Select
  - 修复 placeholder 国际化 bug (#17644 by @nzh63)
  - 修复 value 为 Boolean 类型的bug (#21052 by @cs1707)
- Table
  - 修复 lazy load data (#21041 by @cs1707)
- TypeScript
  - 增加 CascaderPanel 类型导出 (#21070 by @qige2016)
  - 增加 spinner.d.ts (#21090 by @qige2016)
- Utils
  - 修复 fix isScroll (#21065 by @cs1707)
  - 修复 (utils.dom by @fw6)
- 其他
  - 修复 isFunction (#20912 by @cs1707)

#### 优化

- Doc
  - 更新 Axure 设计资源 v2.1.0 (by @iamkun)
  - 更新法语文档 datetime-picker.md (#20543 by @lonk)
  - 更新 Progress 组件文档 (#20641 by @cs1707)
  - 修改 form 组件 hide-required-asterisk 描述 (#21045 by @cs1707)
  - 修复 hr 语言 week 翻译 (#21040 by @cs1707)
  
### 1.5.3
*2021-01-07*

#### 新特性

- Statistics
  - 新增统计数值组件
  
### 1.5.2
*2021-01-05*

#### 新特性

- Description
  - 新增描述列表组件

### 1.5.1
*2021-01-04*

#### 新特性

- Ellipsis
  - 新增Ellipsis文本自动省略组件
- JsonForm
  - 新增JsonForm组件，替换原有的 `DynamicForm`
  - `ui-schema` 内新增 `ui:nativeOn` 属性用于绑定原生事件

### 1.5.0
*2021-01-04*

同步至Element-UI 2.14.1版本

#### 新特性

- Alert
  - 新增高饱和度主题 (#15041 by @island205)
- Autocomplete
  - 添加 change 事件 (#17913 by @sxzz)
  - 添加 `highlight-first-item` 属性，控制是否默认突出显示远程搜索建议中的第一项 (by @YamenSharaf in #14269)
  - 新增 `clear` 事件，#12171(by arthurdenner) #13326
- Avatar
  - 新增 `Avatar` 组件 (#16144 by @luckyCao)
- Backtop
  - 新增 Backtop 组件 (#15541 by @iamkun)
- Calendar
  - 新增 Calendar 组件 (#14908 by @ziyoung)
  - 支持 `first-day-of-week` 配置 (#16047 by @ziyoung)
- Cascader
  - 新增多选模式和 filter-method 方法 (#15611 by @SimonaliaChen)
  - 新增 `visible-change` 事件，#13415
- Carousel
  - 新增 direction 属性，支持垂直方向切换 (#15122 by @ziyoung)
  - 新增 `loop` 属性，#13217
- Collapse
  - CollapseItem 支持禁用 (#15076 by @ziyoung)
- DatePicker
  - 支持字符串常量 (#15525 by island205)
  - 支持 monthrange 类型 (#14487 by @zxyRealm)
  - 新增 `validate-event` 属性 (by @ziyoung in #13531)
- DateTimePicker
  - `pickerOptions` 支持 `selectableRange` 选项 (by @eeeeeeeason)
- Drawer
  - 新增抽屉组件 (#16577 by @JeremyWuuuuu)
- Divider
  - 新增 Divider 组件 (#15055 by @island205)
- DropdownItem
  - `el-dropdown-item` 支持添加 icon (by @gabrielboliveira in #14088)
- Form
  - `validateField` 方法可以接收参数，#13319
- Icon
  - 支持 font-display 属性的配置 (#16805 by @iamfaizalandyka)
  - 新增图标 (#15214 by @iamkun)
- Image
  - 新增 Image 组件 (#15117 by @SimonaliaChen)
  - 支持 attrs 和 listeners (#15578 by @VanMess)
- InfiniteScroll
  - 新增 InfiniteScroll 指令 (#15567 by @iamkun)
- Input
  - 新增 `show-word-count` 属性 (#15075 by @luckyCao)
  - 添加 `show-password` 属性，支持配置显示密码按钮 (by @phshy0607 in #13966)
- InputNumber
  - 新增 `step-strictly` 属性 (#15050 by @luckyCao)
  - 新增 `select` 方法，#13286 (by @st-sloth)
- Link
  - 新增 Link 组件 (#15052 by @iamkun)
- Message
  - 信息依次展示 (#15639 by @island205)
- PageHeader
  - 新增 PageHeader 组件 (#15714 by @ziyoung)
- Pagination
  - 新增 hide-on-single-page 属性 (#15096 by @ziyoung)
- Popover
  - 添加 close-delay 属性 (#16671 by @LachlanStuart)
- Rate
  - 支持通过对象自定义 colors 与 icon-classes 属性 (#15051 by @SimonaliaChen)
- Select
  - 添加 slot `empty` (by @elfman in #13785)
- Slider
  - 新增 marks 属性 (#15133 by @luckyCao)
- Table
  - Tree Table 支持 tree-props，default-expand-all，expand-row-keys 属性, toggle-row-expansion 方法，expand-change 事件 (#15709 by @ziyoung)
  - 增加对树形结构数据的支持 (#14632 by @ziyoung)
- Tabs
  - 卡片模式下标题左对齐 (#15695 by @luckyCao)
- Tag
  - 新增 effect 属性 (#15725 by @SimonaliaChen)
  - 新增 `click` 事件 (by @licdream in #14106)
- Theme
  - 增加 Chrome 插件: Element Theme Extension (#16686 by @iamkun)
  - 新增 popup 背景配置 (#15412 by @iamkun)
- Timeline
  - 添加 Timeline 组件 (by @jikkai in #14248)
- Tooltip, Dropdown, Popover
  - 新增 tabindex 属性 (#15167 by @ziyoung)
- Tree
  - 新增 `iconClass` 与 `currentNodeKey` 属性，#13337 #13197 (by @isnifer)
- Upload:
  - 支持自定义缩略图模版 (#13192 by @victorzhuk)

#### 非兼容性更新

- Form
  - 移除输入框的成功状态 (#16159 by @ziyoung)
- Popconfirm
  - 事件名称修改为 `confirm`, `cancel` (#20240 by @hugiron)
  - 新增 Popconfirm 组件 (#17548 by @iamkun)
- Rate
  - 禁用情况下，显示小位数 (#15089 by @haoranyu)
- Select
  - 过滤情况下，placeholder 为选中选项的 label (#14989 by @ibufu)
- Table
  - 修复 row 事件的参数顺序 (by @jikkai in #12086)

#### 修复：

- Alert
  - 更新 typescript 定义文件 (#15186 by @ziyoung)
  - 组件对通过 slot 传入的 description 也应用默认样式类 (by @iamkun in #14488)
- Autocomplete
  - 修复 'change event' 错误 (#19200 by @sxzz)
  - 修复类型为 textarea 时建议错误问题 (#18478 by @Roojay)
  - 修正下拉框最后一行显示不完整的问题 (by @ziyoung in #13597)
  - 修正下拉框箭头 (by @liuchuzhang in #13762)
- Avatar
  - 修复图片不居中的问题 (#16489 by @luckyCao)
- BackTop
  - 平滑过渡动画 (by @lon)
- Calendar
  - 导入 el-button 和 el-button-group (#17376 by @masongzhi)
  - 修复日期的显示问题 (#16772 by @ubitoffee)
  - 修复在夏令时的显示问题 (#17208 by @iamkun)
  - 更新显示正确的 header 的逻辑 (#16354 by @ziyoung)
  - 修复星期展示错误 (#15399 by @qingdengyue)
  - 修复十月展示问题 (#15394 by @qingdengyue)
- Carousel
  - 修复 console.warn 文案拼写错误 (#18264 by @IceFox)
  - 修复 change 的触发时机 (#16705 by @iamkun)
  - 组件销毁时释放内部 Timer (by @elfman in #13820)
- Cascader
  - 修复 TypeScript 3.7 的兼容问题 (#17881 by @CarterLi)
  - 修复 CascaderPanel 的显示问题 (#16716 by @zhangHongEn)
  - 禁用状态下，关闭按钮不显示 (#16224 by @yyjjqq94)
  - 修复一级菜单更新问题 (#16399 by @luckyCao)
  - 懒加载时设默认值 (#16420 by @luckyCao)
  - 修复当节点值重复时的显示问题 (#15935 by @junyiz)
  - 对外暴露 getCheckedNodes 和修复 options 改变会影响选中的问题 (#16709 by @SimonaliaChen)
  - 移除已废弃的计算属性的 cache 属性 (by @iamkun in #13737)
  - 修正 TypeScript 中 CascaderOption 类型定义 (by @NateScarlet in #13613)
  - 修正图标覆盖文字的问题 (by @ziyoung in #13596)
- Checkbox
  - 修复 CSS 样式问题 (#16006 by @Hazlank)
  - 改进显示样式 (by @PanJiaChen)
- ColorPicker
  - 修复十六进制颜色字符串解析问题 (#14793 by @iamkun)
- DatePicker
  - 修复选择最小日期的 bug (#17191 by @smk0621)
  - 给 picker-option 添加 className 属性 (#16632 by @iamkun)
  - 修复 first-day-of-week 的计算 (#14523 by @sinchang)
  - 修复 WeekPicker value-format 的问题 (#13754 by @wacky6)
  - 修正 TimeSpinner 中缺失的 v-for `key` 属性 (by @Ende93 in #13547)
  - 修正周选择器在跨年时的高亮行为 (by @suyi91 in #13883)
- DateTimePicker
  - 修复时间选择滚动条的问题 (#16854 by @jesse-li)
- Dialog
  - 添加 SCSS 变量 (#16365 by @haoranyu)
  - 增加 destroyOnClose 属性 (#16455 by @ziyoung)
  - 修复内容不换行的问题 (#15027 by @iamkun)
  - 可以设置背景色 (#14939 by @ziyoung)
- Directive
  - RepeatClick: 使用 Date.now 提升性能 (#14776 by @pavelmash)
- Divider
  - 支持自定义类 (#17078 by @island205)
- Drawer
  - 修复 drawer-append-to-body 失效的 bug (#16953 by @JeremyWuuuuu)
- Dropdown
  - 更新类型文件 (#17550 by @iamkun)
  - 更新 split-button 默认颜色 (#15931 by @JuniorTour)
  - 修复样式 (#14907 by @doing123)
  - 兼容 Vue 2.6 新 v-slot 语法 (#14832 by @ziyoung)
  - 修复样式问题 (by @hetech in #14452)
- Form
  - ValidateField 的回调应为可选项 (#17314 by @CarterLi)
  - 修复 form-item 的高度错误 (#15457 by @SimonaliaChen)
  - 修复 resetFields 问题 (15181 by @luckyCao)
  - 修复动态表单校验规则不生效的问题 (#14985 by @luckyCao)
  - 修复 label 的样式 (#14969 by @ziyoung)
  - 当 required 为 true 时，显示星号 (#15144 by @ziyoung)
  - 修复 `label-width` 为 `auto` 的样式 (#14955 by @ziyoung)
  - `label-width` 支持自动宽度 (#14944 by @ziyoung)
  - Form 禁用时不显示 Input 的 clear 图标，#13208
- Icon
  - 更新 Select 与 Cascader 的 icon (#15264 by @SimonaliaChen)
  - 更新 icon (#15258 by @iamkun)
- Image
  - 更新错误状态 (#19194 by @lhx6538665)
  - 修复当 preview-src-list 属性不包含 src 时图片预览大图展示为空的问题 (#18975) (#19130 by @luckyCao)
  - 修复第二次图片预览时快捷键失效问题 (#18983) (#19156 by @luckyCao)
  - 修复 preview-src-list 为空时点击图片会给 body 添加 overflow: scroll 的问题 (#18967 by @inooNgt)
  - 优化用户体验 (#16985 by @luckyCao)
  - 优化大图片展示问题 (#16796 by @luckyCao)
  - 修复 Image 组件 SSR 兼容性 (#16737 by @luckyCao)
  - 增加大图预览 (#16333 by @luckyCao)
  - 修复 ssr 问题和 object-fit 的兼容性 (#15346 by @SimonaliaChen)
- InfiniteScroll
  - 跳过不可见元素触发 (#17553 by @iamkun)
  - 更新命名和说明 (#16698 by @iamkun)
  - 更新包名 (#16125 by @iamkun)
- Input
  - 修复韩语输入问题 (#15069 by @MoonHyuk)
  - 触发清除按钮的点击事件 (#16576 by @a631807682)
  - 修复 show-word-count 样式问题 (#15359 by @lvjiaxuan)
  - 修复删除图标样式 (#15354 by @YiiGuxing)
  - 当类型改变时更新 DOM (#14889 by @wacky6)
  - Fix regression (#14572 by @wacky6)
  - 修复 textarea 时的 DOM 节点引用 (by @laomu1988 @island205 in #13803)
- Link
  - 修复图标 class 问题 (#15752 by @iamkun)
- Loading
  - 修复 Dom 不更新的问题 (#15123 by @FAKER-A)
- InputNumber
  - 正确计算 inputNumberDisabled (#18439 by @ashuser-pendo)
- Menu
  - 修复 NavigationDuplicated 在 vue-router@^3.1.0 的报错 (#17269 by @iamkun)
  - 修复 `popper-append-to-body` 设置后，子菜单无法收起的问题 (#15391 by @PanJiaChen)
  - 如果 defaultIndex 不存在，activeIndex 应该为空 (#14074 by @hoythan)
  - 修复浏览器标签切换引起的 focus 问题 (by @liupl in #13976)
- Message
  - 修复关闭的 offsetHeight（#17564） (#17852 by @gzwgq222)
  - 类型定义中添加 `offset` 属性 (#16027 by @matjaz)
  - 修复 typescript 定义文件 (#14968 by @agoni1212)
- MessageBox
  - 修复图表位置 (#17410 by @nullptru)
  - 修复 `distinguishCancelAndClose` 行为与文档不符的问题 (#15438 by @qingdengyue)
  - 修复 TS 定义 (by @NateScarlet in #14278)
- NavMenu
  - 修复点击 el-submenu 多次触发 childMenu 问题 (#14443 by @PanJiaChen)
- Notification
  - 不修改传入的 option (#16704 by @iamkun)
  - 修复标题不换行的问题 (#15008 by @iamkun)
- Pagination
  - 修复 slot 未更新的问题 (#14711 by @lucyhao)
  - 输入框的值不会小于 1 (by @elfman in #13727)
- Popover
  - 兼容 Vue 2.6 新 v-slot 语法 (#20424 by @iamkun)
  - 修正 hover 的触发行为 (by @goldengecko in #13104)
  - 修正弹出框的内存泄漏 (by @qpxtWhite in #13988)
- Progress
  - 修复参数错误的问题 (#19985 by @Caaalabash)
  - 增加 strokeLinecap 属性 (#17552 by @iamkun)
- PopupManager
  - 修复无法复写 `z-index` 的问题 (#15738 by @luckyCao)
- Radio
  - 修复 value 不更新的问题 (#14809 by @OverTree)
  - 改进显示样式 (by @ohhoney1)
- RadioGroup
  - is 指定时，不产生非法的 HTML 片段 (#17070 by @nullptru)
- Scrollbar
  - 修复 FireFox 双滚动条的 bug (#18091 by @iamkun)
  - 修复点击鼠标右键导致拖动的问题 (by @xifeiwu in #14196)
- Select
  - 修复测试用例  (by @msidolphin)
  - 修复空 tag 的 bug (17199 by @luckyCao)
  - 过滤时，不收起下拉框 (#17205 by @luckyCao)
  - 修复内存泄漏问题 (#16463 by @island205)
  - 修复 `initialInputHeight` 问题 (#15989 by @yyjjqq94)
  - 修复输入中文时 `default-first-option` 的行为问题 (#15431 by @VanMess)
  - `import` 重复 (#16215 by @lengband)
  - 回滚清除时，设置 value 为 null 的修改 (#15447 by @iamkun)
  - 修复当 value 为 undefined 或者 null 的报错 (#15022 by @luckyCao)
  - 清空时设置 value 为 null (#14322 by @aaronfulkerson)
  - 修复多次点击 Select 才显示下拉列表的问题，#13268
- Slider
  - 补充 `input` 事件文档 (#15588 by @VanMess)
  - 修复点击时样式问题 (#15561 by @luckyCao)
  - 修复可访问性问题 (#14792 by @erezsob)
  - 修正源代码缩进 (by @wacky6 in #13955)
- Steps
  - 修复 #14502 (#14596 by @sinchang)
  - 修复简单模式下的样式 (#14610 by @sinchang)
- Style
  - 修复媒体查询 sm-only, md-only, lg-only 问题 (#14611 by @sinchang)
  - 调整小屏幕（xs）媒体查询断点，#13468 （by @alekoshen712）
- Submenu
  - 修复 append-to-body 问题 (#16289 by @a631807682)
- Switch
  - 修复事件重复触发问题 (#15178 by @FAKER-A)
  - 添加 `validate-event` 属性，设置改变 Switch 状态时是否触发表单的校验 (by @hetech in #14426)
- Table
  - 头部可自定义 (#17291 by @ziyoung)
  - 更新头部样式 (#17284 by @ziyoung)
  - 修复时候 filter 之后高度问题 (#17348 by @ziyoung)
  - 修复 row-style 失效的 bug (#17002 by @a631807682)
  - 修复头部消失的 bug (#17341 by @ziyoung)
  - 在表头拖拽后阻止 click 事件的触发 (#16850 by @ziyoung)
  - 修复表头 display 为 none 造成浏览器崩溃的问题 (#16956 by @luckyCao)
  - 修复没有数据的时表格高度问题 (#16861 by @ziyoung)
  - 调用 toggleExpansion 不再抛出异常 (#16304 by @yyjjqq94)
  - 挂载时不再触发 sort-change 事件 (#17113 by @a631807682)
  - 修复 setCurrentRow 方法不生效的问题 (#16879 by @ziyoung)
  - 修复当数据异步加载时，expand-row-keys 不生效的问题 (#16899 by @ziyoung)
  - 把 toggleAllSelection 设置为 Table 示例的属性 (#17137 by @ziyoung)
  - 修复 tree table 数据更新问题 (#16481 by @island205)
  - 排序 icon 问题修复 (#15439 by @bezany)
  - 修复 `append` slot 存在时布局错位问题 (#16332 by @ziyoung)
  - 修复 `showOverflowTooltip` 更新无效的问题 (#16295 by @a631807682)
  - 修复 `FilterPanel` 中 `Scrollbar` 未注册问题  (#16246 by @ziyoung)
  - 修复加载 icon 不显示的问题 (#15868 by @ziyoung)
  - 修复复杂表格中 hover 行背景色问题 (#15504 by @cnlon)
  - 修复 `current-row-key` 和选择事件的问题 (#15983 by @ziyoung)
  - `height` 属性接受更多单位 (#16013 by @ziyoung)
  - 修复 `reserve-selection` 无效的问题 (#16135 by @ziyoung)
  - 修复排序条件为空时的排序问题 (#15012 by @joelxr)
  - 修复懒加载时加载数据的 bug (#15101 by @ziyoung)
  - 在合并单元格时，修复单元格的宽度计算不正确的问题 (#15196 by @ziyoung)
  - 提升表格的性能 (#14868 by @ziyoung)
  - 初始化时不再触发 sort-change 事件 (#14625 by @PeanutWatson)
  - 让 height 与 max-height 属性的行为保持一致 (#14660 by @arthurdenner)
  - 修复当有展开列时 `defaultExpandAll` 的行为 (#14935 by @ziyoung)
  - Table footer 与 body 的对齐一致 (#14730 by @ziyoung)
  - 修复多 Table 实例共享 `toggleAllSelection` 方法，造成无法切换问题 (by @letanure in #14075)
  - 改进点击排序箭头时的行为 (by @ohhoney1 in #12890)
  - 修正 IE10+ 中 “暂无数据” 提示的垂直布局 (by @imzjy in #13638)
  - 修正文档中 `index` 的类型说明 (by @ilovefafa in #13628)
  - 修正多级表头使用 `fixed` 属性时，表尾合计行的显示样式 (by @luckyCao in #13914)
  - data 改变时，高亮行会继续保留，#13200
  - header slot 可以接收参数，#13263
  - `clearFilter` 方法支持参数，#13176
  - 单元格内没有内容时不再创建 Tooltip，#13152 (by @rongxingsun)
- Tabs
  - 修复 TabItem 位置不正确的问题 (#16520 by @victorting)
  - 修复高亮的 Tab 不在可视区的问题 (#17033 by @nullptru)
  - 修复 padding 问题 (#15461 by @SimonaliaChen)
  - Fix issue where Promise rejection was hitting application (#14816 by @ffxsam)
  - slot 改变时，重新渲染 (#15238 by @ziyoung)
  - 阴影样式使用全局主颜色 (#14558 by @Richard-Choooou)
  - 当 label 改变时触发更新 (#14496 by @akki-jat)
  - 修复样式问题 (by @hetech in #14452)
  - 修正自动滚动 (by @iamkun in #13696)
  - 通过面板名称查找面板 (by @iamkun in #13705)
  - 使用 `paneName` 计算面板样式 (by @iamkun in #13733)
- Tag
  - 修复阻止冒泡问题 (#15150 by @infjer)
- Theme
  - 添加无圆角变量 (#15256 by @iamkun)
- Timeline
  - 修复逆序问题 (#16091 by @ziyoung)
- TimePicker
  - 滚动后设置正确的位置 (#16868 by @mattheyan)
- Tooltip
  - 修复自定义 tabindex 不生效问题 (#15619 by @SimonaliaChen)
  - 当初始值为 true 时默认显示 (#14826 by @ziyoung)
- Transfer
  - 修复和 Form 组件一起使用时错误的行高问题 (#18917 by @Hanx)
  - 修复样式问题 (#17206 by @iamkun)
- Tree
  - 增加 font-size 样式 (#17094 by @spengjie)
  - 修复文字与复选框之间的距离 (#16799 by @Hazlank)
  - 更新类型定义为泛类型 (#15934 by @JeremyWuuuuu)
  - 修复设置节点 isCurrent 的为 false 的问题 (#15870 by @kkkisme)
  - 当 `currentKey` 为 `null` 时取消对树节点的高亮 (#15668 by @yyjjqq94)
  - 修复多实例共享数据的问题 #15538 (#15615 by @VanMess)
  - 当前节点被删除后，选中的节点也应该删除 (#14604 by @sinchang)
  - 提升性能 (#14881 by @ChenZhuoSteve)
  - 恢复 pr #13349 (#14847 by @ziyoung)
  - 与 Table 统一占位文样式 (by @ColinCll in #14331)
  - 修正 `showCheckbox` 不能影响子节点的问题 (by @KidneyFlower)
  - 更新文档和 TypeScript 定义 (by @ziyoung in #13540)
  - 修复 `defaultCheckedKeys` 导致显示的错误，#13349 (by @dive2Pro)
- Type
  - 修复 Loading 定义文件 (#15635 by @iamkun)
  - 修复 Icon 定义文件 (#15634 by @iamkun)
  - 修复 Link 定义文件 (#15402 by @iamkun)
- Upload
  - 更新 `fileList` 的类型定义 (#15716 by @underfin)
  - 修复 Upload 的背景颜色 (#15039 by @iamkun)
  - `list-type` 改变时，保留 `url` 属性 (by @elfman in #13771)

#### 优化：

- Alert
- Cascader
  - 重构 (#15611 by @SimonaliaChen)
- DatePicker
  - 添加月、年高亮的样式（by @Debiancc in #14211）
- Input
  - 简化内部实现，遵循单向数据流；修复若干相关 Bug (by @wacky6 in #13471)
- InputNumber
  -移除多余的 `parseFloat` (by @JuniorTour in #14172)
- Menu
  - 支持 `el-menu-item` 不添加 index (by @georgyfarniev in #13298)
- Table
  - 移除无用的 DOM 操作 (by @elfman in #13643)
- Tag
  - 兼容 IE (#16334 by @ziyoung)
- Upload
  - 代码优化 (by @elfman in #13973)
- Popup
  - 移除无用代码 (by @KAionro in #14413)
- 其他
  - 升级到 webpack@4 (by @jikkai in #14173)
  - 更新 Axure 文件，增加新组件 (by @ziyoung in #13773)

### 1.4.33
*2018-11-14*

### 修复

- ButtonGroup
  - 修复在按钮类型为默认的场合，Dropdown里的按钮左边框颜色错误的问题

### 1.4.32
*2018-11-14*

### 修复

- Form
  - 修复 `label-width` 属性为对象（即使用自适应布局样式）的场合，必须输入项目Label样式错误的问题。

### 1.4.31
*2018-11-12*

### 修复

- Select
  - 修复控制台出现【The computed property "readonly" is already defined as a prop.】警告的问题。

### 1.4.30
*2018-11-09*

### 修复

- 其他
  - 修复通过全局方式设置默认size时，没有生效的问题

### 1.4.29
*2018-11-01*

同步至Element-UI 2.4.9版本

### 新特性

- Alert
  - 新增 `title slot`，#13082（by @Kingwl）
- Badge
  - 新增 `type` 属性，#12991
- Select
  - 多选时可以清除 Select 已选中的值，#13049（by @ZSkycat）
- Table
  - 用户可以使用 scoped-slot 来自定义表头，#13012（by @ivanseidel）

### 修复

- Form
  - `clearValidate` 方法参数支持字符串，#12990 （by @codinglobster）
- InputNumber
  - 当 InputNumber 控制按钮不显示时，调整了边距，#13052
- List
  - 加载时不显示 `Empty` 内容
  - loading区域背景色改为透明
- Select
  - 修复 IE 下 Select 输入框不能输入的问题，#13034（by @GaliMU）
  - Select 多选时，选项不换行，#12329 （by @akki-jat）
  - Select 下拉列表展开后，箭头图标也可以正确显示，#12353（by @firesh）
  - 修复 Select 的 size 属性不生效的问题，#13070
- Tab
  - 修复最后一个 TabNav 不能删除的问题，#13039
  - 修复 TabNav 中 label 显示不正确的问题，#13178
- Table
  - 修复 Table 中的 tooltip 内容不正确的问题，#13159（by @elfman）
- Upload
  - 优化 Upload 文件列表删除时的动画，#12987

### 1.4.28
*2018-10-26*

### 修复

- List
  - 修复ListItem内的组件需要显示设置width的问题

### 1.4.27
*2018-10-24*

### 新特性

- Avatar
  - 新增头像组件

### 1.4.26
*2018-10-10*

同步至Element-UI 2.4.8版本

### 新特性

- Dialog
  - 新增 `opened` 事件，#12828
- Form
  - 新增 `slot-scope` 展示表单校验信息，#12715 （by @YamenSharaf）
  - Form 的 validate 事件参数中新增校验的信息，#12860 （by @YamenSharaf）
- Input
  - 新增 `autocomplete` 属性，废弃 `auto-complete` 属性，#12514 （by @axetroy）

### 修复

- Cascader
  - 修复 Input 未高亮的问题，#12341
  - 修复选择值不正确的问题，#12508 （by @huangjinqiang）
- ColorPicker
  - 修复取色光标位置不正确的问题，#12376 （by @cnwhy）
- DatePicker
  - 修复未触发表单检验的问题，#12328，#12348
  - 修复多选时报错的问题，#12347
  - 修复选择时间时 spinner 位置不正确的问题，#12415 （by @rang-ali）
  - 修复输入框自动填充的问题，#12521 （by @abdallanayer）
  - 修复没有校验用户输入时间的合法性问题，#12898
- Dropdown
  - 修复 Dropdown 在 ButtonGroup 中样式问题，#12819 （by @bluejfox）
- Form
  - 修复Form在嵌套时 label 显示不正确的问题，#12748
- Menu
  - 调整 Submenu 的样式，#12457
  - 修复 Submenu 选中后没有高亮的问题，#12479
- Pagination
  - 修复输入框值不正确的问题，#12525
  - 调整触发事件的顺序，#12530
- Select
  - 修复在单选时 Input 高度变化的问题，#12719
- Switch
  - 修复Switch 聚焦时不显示轮廓，#12771
- Table
  - 修复 `filter` 不显示的问题，#12539
  - 修复表头的 `render-header` 属性不生效的问题，#12914
- Tab
  - 修复 Tabpane 顺序不正确的问题，#12346
  - 修复 TabNav 显示顺序不正确的问题，#12846
  - 修复 Tabs 没有滑动到选中 tab 的问题，#12948
- Tree
  - 修复无法删除节点的问题，#12684
  - 修复 Tree 节点在拖拽时标识符不显示的问题，#12854

### 1.4.25
*2018-09-25*

#### 修复

- List
  - List组件的 `grid` 属性当没有设置全部自适应属性时，设置的自适应属性没有生效

### 1.4.24
*2018-09-20*

#### 新特性

- Card
  - 新增支持封面、头像、标题和描述信息的卡片

### 1.4.23
*2018-09-19*

#### 新特性

- Card
  - 新增 `type` 属性，优化卡片嵌套时的表现形式

### 1.4.22
*2018-09-19*

#### 修复

- ButtonGroup
  - 修复在Button的 `type` 属性为默认值的场合，Dropdown内的按钮左侧Border没有显示的问题

### 1.4.21
*2018-09-19*

#### 新特性

- ButtonGroup
  - 支持Dropdown组件（目前Dropdown组件放置于ButtonGroup最末尾）

### 1.4.20
*2018-09-18*

#### 修复

- DateTimePicker
  - 解决时间为空，组件自动设置当前时间后，值无法被选中的问题

### 1.4.19
*2018-09-18*

#### 新特性

- DateTimePicker
  - 新增日期和时间输入框获得焦点时自动选中日期和时间

### 1.4.18
*2018-09-17*

#### 修复

- Form
  - 解决FormItem没有正确渲染for和style属性的问题

### 1.4.17
*2018-09-11*

#### 修复

- Tree
  - 解决删除Tree的data属性中某一条数据后，对应的节点没有被删除的问题([#12684](https://github.com/ElemeFE/element/issues/12684))

### 1.4.16
*2018-08-31*

#### 修复

- Badge
  - 解决使用Badge的页面出现status参数错误警告的问题

### 1.4.15
*2018-08-24*

#### 新特性

- Badge
  - 添加 `status` 和 `text` 属性

### 1.4.14
*2018-08-22*

#### 其他

- Dialog
  - `title` 属性和 `title` 插槽都为空的场合，不渲染dialog-header。

### 1.4.13
*2018-08-22*

#### 其他

- Dialog
  - 将关闭按钮移出Header节点，以便于更灵活的自定义对话框的样式

### 1.4.12
*2018-08-13*

#### 修复

- Form
  - 修复表单项目的值显示错误的问题

### 1.4.11
*2018-08-13*

#### 修复

- Form
  - 修复使用自适应布局样式时，表单项目标签对齐属性 `label-position` 没有生效的问题。

### 1.4.10
*2018-08-10*

同步至Element-UI 2.4.6版本

#### 新特性

- Autocomplete
  - 添加 `popper-append-to-body` 属性，#12241
- Form
  - 现在 Form 的 `clearValidate` 方法支持传入参数，指定需要清空校验结果的 FormItem，#11821
- MessageBox
  - 新增 MessageBox 的 `distinguishCancelAndClose` 属性，#11831
- Pagination
  - 添加 `page-size` 属性 `sync` 修饰符的支持，#12281
- Table
  - 新增 `toggleAllSelection` 方法，#12047

#### 修复

- Cascader
  - 修复 Cascader 未转义特殊字符的问题，#12248
- DatePicker
  - 修复初始值为 `null` 的 TimeSelect 在执行 `resetField` 后无法再赋值的问题，#12010
- Dialog
  - 修复 Dialog 在全屏显示时宽度不正确的问题，#12203
- Input
  - 修复 Input 触发两次表单校验的问题，#12260
  - 修复 Input 包含 Select 时，suffix 插槽位置显示不正确的问题，#12108
  - 修复 Input 组件 `suffix` 与 `append` 共存时样式错乱问题，#11951
  - 修复可清空的只读 Input 仍会显示清空图标的问题，#11967
- Menu
  - 修复 Menu 在更改 `collapse` 时不保存菜单激活状态的问题，#12178 (by @elfman)
- Popover
  - 修复 Popover 在 InputNumber 聚焦时不显示的问题，#12284
- Radio
  - 修复禁用的 RadioButton 在点击时显示 box-shadow 的问题，#12262
  - 修复 Radio 的 label 不阻止事件冒泡的问题，#11912
- Select
  - 修复 Select 初始值为 `undefined` 时方向键失效的问题，#12322
  - 修复 Select 多选时输入的关键字消失的问题，#12304
  - 修复 Select 多选时查询函数没有去抖的问题，#12181
  - 修复 Option 的 `line-height` 无法设置的问题，#12120
  - 修复重置表单后触发 Select 组件校验问题，#11837
- Table
  - 修复 Table 的 filter 初始值为空数组时不显示筛选图标的问题，#12165
  - 修复 Table 设置 `class-name` 对 `expand` 列不生效的问题，#12006
  - 修复 Table 的 `empty-text` 过长时的位置样式问题，#11965
  - 修复 Table 的 `current-row-key` 设置为 `null` 时高亮行不清除的问题，#11866
  - 修复当 `filters` 为空数组时显示过滤器下拉列表的问题，#11864
- Tree
  - 修复 Tree 在懒加载时添加节点导致节点消失的问题，#12256
  - 修复 Tree 节点在拖拽后无法删除的问题，#12279
  - 修复 Tree 组件中不响应方向键以外 keydown 事件的问题，#12008
  - 修复 Tree 在懒加载情况下选中父节点的问题，#12106
  - 修复 Tree 节点禁用时仍可以选中的问题，#11847
  - 修复 Tree `default-checked-keys` 属性不生效的问题，#11971
  - 修复 Tree 在过滤节点时下 `empty-text` 不显示的问题，#11971
  - 修复当自定义 Tree 节点高度时，`allow-drop` 不能正常工作的问题，#11797
  
#### 其他

- ThemeChalk
  - 修复 Main 在 IE 下的显示不正确的问题，#12237

### 1.4.9
*2018-08-10*

#### 新特性

- Form
  - 新增wrapper-width属性支持表单组件自适应样式。

### 1.4.8
*2018-07-25*

#### 修复

- Button
  - 解决持有链接功能按钮当处于文字状态时，按钮Label下显示下划线的问题。

### 1.4.7
*2018-07-25*

#### 新特性

- List
  - 新增 `empty-text` 属性，当List没有数据时，显示对应的提示文本。

### 1.4.6
*2018-07-24*

#### 新特性

- Button
  - 新增 `href` 和 `target` 属性，实现与a 链接一致的行为

#### 其他

- Upload
  - 移除 `after-select` 和 `file-output-type` 属性

### 1.4.5
*2018-07-17*

#### 新特性

- Divider

### 1.4.3
*2018-07-03*

同步至Element-UI 2.4.2版本

#### 新特性

- Dialog
  - 新增 `closed` 事件，#11490
- MessageBox
  - 新增 `iconClass` 属性
- Tabs
  - 新增 `stretch` 属性
  - Tabs 的 `before-leave` 钩子添加了 `activeName` 和 `oldActiveName` 参数，#11713

#### 修复：

- Autocomplete
  - 移除 Autocomplete 的重复类型声明
- ButtonGroup
  - 修复 ButtonGroup 中只有一个 `round` 或 `circle` 的 Button 时的样式错误，#11605
- Cascader
  - 修复在 `change-on-select` 状态下点击选项不关闭的问题，#11623
  - 修复 Cascader 关闭后的聚焦问题，#11588
- Menu
  - 修复 `collapse` 属性变化后无法使用 `open` 方法的问题，#11646
- Pagination
  - 修复在某些情况下 Pagination 的条目数选择器的样式错误，#11622
- Popover
  - 修复禁用状态下创建弹出框的问题，#11426
- Radio
  - 修复禁用的 Radio 在点击时显示 box-shadow 的问题，#11462
- Select
  - 修复初始值为 `null` 时仍然显示清除图标的问题，#11460
  - 修复嵌套在 Form 内的 Select 在 FireFox 浏览器中下拉箭头错位的问题，#11427
  - 现在通过代码改变 Select 的值后会触发表单校验，与 Input 行为一致，#11672
- Table
  - 修复展开行时无法保留选中行样式的问题，#11464
  - 修复 Table 在 `highlight-current-row` 为 `false` 时点击行也会触发高亮的问题，#11691 #11563
  - 修复 Table 的 `class-name` 和 `label-class-name` 属性不支持动态更新的问题，#11626
- Tabs
  - 修复调用 `before-leave` 并返回 Promise 的时候，Tabs 会存在 focus 状态的问题，#11386
  - 修复开启 `lazy` 时渲染顺序异常的问题，#11461
- Tree
  - 修复在懒加载状态下添加新节点造成无限循环的问题，#11430 （by @wangjingf）

### 1.4.2
*2018-06-01*

#### 修复：

- Dynamic Form
  修正在inline=true的场合，页面显示undefined的问题

### 1.4.1
*2018-05-31*

#### 修复：

- Dynamic Form
  修正type为textarea的项目rows无法设置的问题

### 1.4.0
*2018-05-29*

同步至Element-UI 2.4.0版本

#### 新特性

- 综合
  - 使用原生 webpack 作为构建和打包工具，#11216
  - 可以全局配置弹出层的初始 z-index，#11257
- Autocomplete
  - 新增 `hide-loading` 属性，#11260
- Button
  - 现在圆形按钮也支持通过 `size` 属性改变其尺寸了，#11275
- DatePicker
  - 现在 `type` 属性可以接收 `'dates'`，用于选择多个日期，#10650（by @Mini256）
- FormItem
  - 新增 `clearValidate` 方法，#11076
- InputNumber
  - 新增 `precision` 属性，#11281
- Pagination
  - 新增 `prev-click` 和 `next-click` 事件，#10755
  - 新增 `pager-count` 属性，#10493（by @chongjohn716）
- Select
  - 新增 `prefix` 具名 slot，#11063
  - 新增 `automatic-dropdown` 属性，#10042（by @Seebiscuit）
- Table
  - 新增 `sort` 方法，支持手动排序，#11311
- Tabs
  - 新增 `before-leave` 钩子，#11259
  - 新增 `lazy` 属性，#11167（by @Kingwl）
- Tree
  - `setCurrentKey` 方法支持传入 `null`，可取消当前高亮的节点，#11205
  - `checkOnClickNode` 属性，#11111
  - 新增 `type` 作为 Tree 的 `allow-drop` 属性回调的第三个参数，#10792

#### 修复

- 综合
  - 弹出类组件的 `lockScroll` 属性不再为父元素添加内联样式，而是添加相应类名，#11114
  - 改用 ResizeObserver 对元素的尺寸变化进行监测，#10779
- Autocomplete
  - 修复在快速删除搜索内容后输入建议不正确的问题，#11323
- Breadcrumb
  - 修复 `to` 属性不支持动态更新的问题，#11286
- Cascader
  - 修复可搜索的 Cascader 在输入关键词后，选项的 `disabled` 属性失效的问题，#11185
- Checkbox
  - 修复单个 Checkbox 不支持表单验证的问题，#11271
- ColorPicker
  - 修复关闭选色器时触发 `active-change` 事件的问题，#11304
  - 修复在通过代码改变 ColorPicker 的绑定值后错误地触发 `active-change` 事件的问题，#10903（by @zhangbobell）
- DatePicker
  - 修复 `type` 为 dates 的 DatePicker 在选择非当前月的日期后，面板会跳转至当前月的问题，#10973
  - 修复范围选择的 DatePicker 在未改变值的情况下关闭下拉面板仍会触发 `change` 事件的问题，#11017
  - 修复 DatePicker 的 `type` 为 week 时面板错误高亮的问题，#10712
- Input
  - 修复使用中文输入法快速输入文字时会导致视图重新渲染的问题，#11235（by @STLighter）
  - 修复可清空的只读 Input 仍会显示清空图标的问题，#10912
  - 修复可清空的 Input 在初始值为 `null` 时仍然显示清空图标的问题，#10912
- InputNumber
  - 修复 InputNumber 初始值为 0 时输入框为空的问题，#10714
- MessageBox
  - 修复连续打开两个 MessageBox 时 `el-popup-parent--hidden` 无法移除的问题，#11371
- Popover
  - 修复当触发元素为 Radio 或 Checkbox 时控制台报错的问题，#11265
- Progress
  - 修复在 `status` 为 exception 时图标不显示的问题，#11172
- Radio
  - 修复通过空格可以选中被禁用的 Radio 的问题，#11303
- Rate
  - 修复 `disabled` 的 Rate 仍能通过键盘左右键改变组件值的问题，#10726（by @Richard-Choooou）
- Select
  - 修复 Select 在有分组选项时不能正确通过键盘导航的问题，#11058
  - 修复可搜索的 Select 在备选项均被禁用时，通过键盘导航会造成无限循环的问题，#10945
  - 修复可搜索的单选 Select 在 IE11 中无法输入搜索关键词的问题，#10822
  - 修复单选 Select 在使用鼠标选中某个选项后错误地触发 `blur` 事件的问题，#10822
- Tooltip
  - 修复内容为空时箭头错位的问题，#11335
- Table
  - 修复筛选列表过长导致样式超出的问题，#11314
  - 修复排序后导致无法正常显示选中行样式的问题，#11348
  - 修复当 TableColumn 的 `prop` 属性指定的字段在数据源中不存在时，鼠标移入该列单元格会报错的问题，#11137
  - 修复可展开的 Table 在展开某一行后更新数据源会造成该行无法收起的问题，#11186
  - 修复在由于筛选而使原有的滚动条消失后表头各列宽度未及时更新的问题，#10834
- Tree
  - 修复 Tree 的 `allow-drop` 回调在使用 `type` 参数后的错误行为，#10821
- Upload
  - 修复在 `beforeUpload` 方法返回的 Promise 中 resolve 一个 File 时控制台报错的问题，#11297（by @qusiba）

### 1.3.4
*2018-05-04*

#### 新特性
- JSON Viewer
  - 新增JSON Viewer组件

### 1.3.0
*2018-04-19*

#### 新特性
- List
  - 新增List组件

### 1.3.0
*2018-04-16*
同步至Element-UI 2.3.4版本
Element-UI的更新内容：
#### 新特性
- Autocomplete
  - 新增 `placement` 属性，#10475
- BreadCrumb
  - 现在非链接的 BreadcrumbItem 在 hover 时不再具有视觉反馈，#10551
- Button
  - 新增 `circle` 属性，#10359（by @YunYouJun)
- Card
  - 新增 Card 的 `shadow` 属性，#10418（by @YunYouJun）
- ColorPicker
  - 新增 `predefine` 属性，#10170（by @elfman）
  - 手动输入支持 `hsl`、`hsv` 和 `rgb` 格式，#9991
- Input
  - 新增 `select` 方法，#10229
  - 新增 `blur` 方法，#10356
  - 新增 `clear` 事件，#9988（by @blackmiaool）
- Form
  - `validate` 方法新增第二个参数，包含未通过本次校验的表单项信息，#10279
  - 新增 `validate` 事件，#10351
- Menu
  - SubMenu 新增 `popper-class` 和 `disabled` 属性，#9604 #9771
  - 现在水平模式下的 Menu 支持多级 SubMenu 了，#9741
  - 新增 `collapse-transition` 属性，#8809（by @limichange）
  - 新增 SubMenu 的 `popper-append-to-body` 属性，#10515
- Pagination
  - 新增 `disabled` 属性，#10006
- Popover
  - 新增 `after-enter` 和 `after-leave` 事件，#10047
- Progress
  - 新增 `color` 属性，#10352（by @YunYouJun）
- Slider
  - 新增 `tooltip-class` 属性，#9957
  - 新增 `input-size` 属性，#10154
- Select
  - 新增 `popper-append-to-body` 属性，#9782
  - 新增 `blur` 方法，#10416
- Table
  - 现在 TableColumn 的 `formatter` 属性可以是动态的，#10184（by @elfman）
  - 新增 `select-on-indeterminate` 属性，#9924（by @syn-zeta）
  - 新增 `$index` 作为 Table 的 `formatter` 属性回调的第四个参数，#10645
- Transfer
  - 新增 `clearQuery` 方法，#9753
  - 新增 `target-order` 属性，#9960
  - 新增 `left-check-change` 和 `right-check-change` 事件，#10156
  - 数据项的渲染支持通过 scoped slot 自定义，#10577
- Tree
  - 新增 `node-contextmenu` 事件，#9678
  - 现在可以使用 scoped slot 自定义树节点的模板了，#9686
  - 新增 `getNode`、`remove`、`append`、`insertBefore`、`insertAfter`、`getCheckedKeys`、`getHalfCheckedNodes`、`getHalfCheckedKeys` 方法和 `check` 事件，#9718 #9730
  - 新增 `draggable`、`allow-drop` 和 `allow-drag` 属性，以及 `node-drag-start`、`node-drag-enter`、`node-drag-leave`、`node-drag-over`、`node-drag-end` 和 `node-drop` 事件，#9251 #10372（by @elfman）

#### 修复
- Autocomplete
  - 修复 Autocomplete 报错的问题，#10442
- Badge
  - 修复在 `value` 属性为 `0` 时不显示上标的问题，#10470
- Checkbox
  - 修复 TypeScript 类型声明未导出 CheckboxButton 的问题，#10666
- Container
  - 修复布局组件在 IE11 中无法自动填充可用空间的问题，#9655
  - 修复 Aside、Header 和 Footer 在某些布局中被压缩的问题，#9812
- DatePicker
  - 现在时间日期选择器下拉面板中的值能够正确地从 `format` 属性中获取对应格式了，#10174（by @remizovvv）
  - 修复在 DateTimePicker 中手动输入日期后不能正确触发 `change` 事件的问题，#9913
  - 现在 DatePicker 的范围选择支持先点选结束日期，再点选开始日期了，#8156（by @earlymeme）
  - 修复 DatePicker 在清除初始值时不触发 `change` 事件的问题，#9986
  - 现在 `default-time` 属性也可用于非范围选择的 DateTimePicker 了，#10321（by @RickMacTurk）
- Form
  - 修复嵌套复合型 Input 时，FormItem 标签与输入框未对齐的问题，#10189
- Input
  - 修复 `type` 属性未传递至原生 input 元素的问题，#10415
- InputNumber
  - 调整 InputNumber `change` 事件的触发时机，使得在回调中能够取得最新的组件绑定值，#10553
- Loading
  - 修复在 `mounted` 中修改 `v-loading` 的值为 true 时不能正确显示 Loading 的问题，#9722
- Menu
  - 现在折叠状态的菜单项仅在传入 `title` slot 时才显示 Tooltip，#10193（by @PanJiaChen）
  - 删除在 TypeScript 类型声明中重复的 `showTimeout` 属性，#10566（by @kimond）
- MessageBox
  - 修复调用 MessageBox 未传入 `title` 时，打开的 MessageBox 会继承上一个实例的 `title` 属性的问题，#10126（by @Pochodaydayup）
- Pagination
  - 修复 `current-change` 在未发生用户交互时错误触发的问题，#10247
  - 修复禁用的上一页、下一页按钮仍会触发 `current-change` 事件的问题，#10628
- Rate
  - 现在 Rate 的图标类相关属性支持动态更新了，#10003
- Tab
  - 修复 TabItem 在浏览器失焦和隐藏后出现蓝色边框的问题，#10503
  - 修复 `type` 为 border-card 的 Tabs 中被禁用标签项的样式，#10640
- Textarea
  - 修复未绑定值的 Textarea 在 SSR 中会显示 `undefined` 的问题，#10630
- Tree
  - 修复节点拖拽相关的问题，#10474 #10494
- Select
  - 现在的 Select 在选中选项后仍然处于 focus 状态，#9857（by @Seebiscuit）
  - 修复鼠标右键点击 Select 的输入框会展开选项的问题，#9894（by @openks）
  - 修复重置表单后，用户第一次改变 Select 的值时不触发校验的问题，#10105
- Switch
  - 修复点击时会触发两次原生 click 事件的问题，#9760
- Table
  - 修复点击可展开行的展开图标会触发 `row-click` 事件的问题，#9654
  - 修复某些情况下通过拖动改变列宽后，布局没有同步更新的问题，#9668
  - 修复合计行与固定列并存时的样式问题，#9667
  - 修复可展开的 Table 在展开某一行后高度未重新计算的问题，#9848
  - 修复设置了 `height` 属性的 Table 在服务端渲染时无法加载的问题，#9876
  - 修复 Table 的固定列在某些情况下宽度不正确的问题，#10130
  - 修复含有固定列的 Table 在设置 `max-height` 属性后有时不能及时更新布局高度的问题，#10034
- Upload
  - 现在拖拽上传会拦截不在 `accept` 属性范围内的文件，#10278

### 1.2.0
*2018-02-05*
从Element-UI 1.4.2更新至最新版本(2.1.0)
以下是Element-UI的更新内容：

#### 新特性
- 综合
  - 新增 `theme-chalk` 主题
  - 增强以下组件的可访问性：Alert、AutoComplete、Breadcrumb、Button、Checkbox、Collapse、Input、InputNumber、Menu、Progress、Radio、Rate、Slider、Switch 和 Upload
  - 新增布局组件 Container、Header、Aside、Main 和 Footer
  - 新增 TypeScript 类型声明
  - 重绘了全部图标，并新增了部分图标
  - 新增了一系列基于断点的工具类，用于当视口尺寸满足一定条件时隐藏元素
  - 新增全局配置组件尺寸的功能。在引入 Element 时，配置 `size` 字段可以改变所有组件的默认尺寸
- Alert
  - 新增 `center` 属性，提供居中布局 #6876
- Autocomplete
  - 新增 `debounce` 属性，#7413
  - Autocomplete 新增 `selectWhenUnmatched` 属性，#6428 @ryatziv
- Breadcrumb
  - 新增 `separator-class` 属性，可使用图标作为分隔符 #7203
- Button
  - 新增 `round` 属性，用于圆角按钮 #6643
- Cascader
  - 新增 `focus` 和 `blur` 事件，#9184（by @viewweiwu）
  - 新增 Cascader 的 `separator` 属性，#8501
- Checkbox
  - 增加 `border` 属性和 `size` 属性 #6690
- ColorPicker
  - 增加手动输入色值的支持 #6167
  - 新增 `size` 属性，用于控制组件的大小 #7026
  - 新增 `disabled` 属性，用于禁用组件 #7026
  - 新增 `popper-class` 属性，#7351
- DatePicker
  - 新增 `prefix-icon` 和 `clear-icon` 属性，#9237（by @AdamSGit）
  - 新增 `default-time` 属性，#9094（by @nighca）
  - `value-format` 属性增加对 `timestamp` 的支持，#9319（by @wacky6）
  - type 为 `datetimerange` 时可以使用 `timeFormat` 格式化时间选择器 #6052
  - 新增 `start-placeholder` 和 `end-placeholder`，用于设置范围选择时两个输入框的占位符 #7169
  - 新增 `value-format` 属性，支持对绑定值的格式进行自定义，#7367
  - 新增 `unlink-panels` 属性，用于在选择日期范围时取消两个日期面板之间的联动
  - 新增 `time-arrow-control` 属性，用于开启时间选择器的 `arrow-control`，#7438
  - DatePicker 的 `default-value` 属性支持 daterange 模式，#7073 @wacky6
- Dialog
  - 新增 `width`、`fullscreen`、`append-to-body` 属性，支持嵌套使用
  - 新增 `center` 属性，提供居中布局 #7042
  - 新增 `focus-after-closed`、`focus-after-open`属性，支持无障碍访问 #6511
- Dropdown
  - 新增 Dropdown 的 `show-timeout` 和 `hide-timeout` 属性，#7621（by @phongkt-dev）
- Form
  - 新增 `disabled` 属性，#9529
  - 新增 `validateOnRuleChange` 属性，#8141
  - 新增 `inline-message` 属性，设置后校验信息会以行内样式显示 #7032
  - 新增 `status-icon` 属性，用于在输入框中显示校验结果反馈图标 #7032
  - Form 和 FormItem 新增 `size` 属性，用于控制表单内组件的尺寸，#7428
  - `validate` 方法在不传入 callback 的情况下返回 promise，#7405
  - 新增 `clearValidate` 方法，用于清空所有表单项的验证信息，#7623
- Input
  - 新增 Input 的 `tabindex` 属性，#9041（by @dicklwm）
  - 新增 Autocomplete 的 `prefix-icon` 和 `suffix-icon` 属性，#8446（by @liyanlong）
  - 新增 Input 的 `clearable` 属性，#8509（by @lbogdan）
  - 新增 `suffix`、`prefix` 的 slot，以及 `suffixIcon`、`prefixIcon` 属性，用于给输入框内部增加前置和后置内容 #7032
- InputNumber
  - 组件绑定变量的值支持 `undefined`，#9361
- Layout
  - 新增断点 `xl`，适用于宽度大于 1920px 的视口
- Loading
  - 通过指令调用的 Loading 现在支持以 `element-loading-custom-class` 属性的方式设置自定义类名，#8826（by @earlymeme）
  - 配置对象新增 `spinner` 和 `background` 字段，支持自定义加载图标和背景色，#7390
- Menu
  - 新增 SubMenu 的 `show-timeout` 和 `hide-timeout` 属性，#8934（by @HugoLew）
  - 新增 `background-color`、`text-color` 和 `active-text-color` 属性，分别用于设置菜单的背景色、菜单的文字颜色和当前激活菜单的文字颜色 #7064
  - 新增 `open` 和 `close` 方法，支持手动打开和关闭 SubMenu，#7412
- Message
  - 图标部分使用 icon 代替图片，从而支持通过 CSS 修改图标背景色 #6207
  - 新增 `dangerouslyUseHTMLString` 属性，使得 `message` 属性支持传入 HTML 字符串<sup>*</sup> #6207
  - 新增 `center` 属性，提供居中布局 #6875
- MessageBox
  - 新增 `closeOnHashChange` 属性 #6043
  - 新增 `center` 属性，提供居中布局 #7029
  - 新增 `roundButton` 属性，使得内部按钮为圆角按钮 #7029
  - 新增 `dangerouslyUseHTMLString` 属性，使得 `message` 支持传入 HTML 字符串<sup>*</sup> #6043
  - 新增 `inputType` 属性，用户指定内部输入框的类型，#7651
- Notificaition
  - 新增 `closeAll` 方法，#9514
  - 新增 `position` 属性，用于配置 Notification 出现的位置 #6231
  - 新增 `dangerouslyUseHTMLString` 属性，使得 `message` 属性支持传入 HTML 字符串<sup>*</sup> #6231
  - 新增 `showClose` 属性，用于隐藏关闭按钮 #6402
- Pagination
  - 新增 Pagination 的 `background` 属性，#8553
  - 新增 `prev-text` 和 `next-text` 属性，用于自定义上一页和下一页的文本 #7005
- Radio
  - 增加 `border` 属性和 `size` 属性 #6690
- Rate
  - 新增 `show-score` 属性，控制是否在右侧显示当前分数 #6295
- Select
  - 新增 `auto-complete` 属性，#9388
  - 新增 Select 的 `collapse-tags` 属性，用于在多选时以文字代替 Tag，避免组件高度的增大，#8190
  - 新增 `reserve-keyword` 属性，用于在选择某个选项后保留当前的搜索关键词
- Slider
  - Slider 新增 `debounce` 属性，#6820 @langgo
- Steps
  - 新增 `simple` 属性，用于开启简洁风格的步骤条 #7274
- Switch
  - Switch 新增 `allow-focus` 属性，#7494（by @breadadams）
- Table
  - `filter-method` 方法加入第三个参数 `column`，#9196（by @liyanlong）
  - 开放 Table 的 `doLayout` 方法，用于重新计算 Table 的布局，#8351
  - 新增 TableColumn 的 `sort-by` 属性，#7828（by @wangfengming）
  - 新增 `span-method` 属性，用于合并行或列
  - 新增 `clearSort` 方法，用于清空排序状态
  - 新增 `clearFilter` 方法，用于清空过滤状态
  - 对于可展开行，当该行展开时会获得一个 `.expanded` 类名，方便自定义样式
  - 新增 `size` 属性，用于控制表格尺寸
  - 新增 `toggleRowExpansion` 方法，用于手动展开或关闭行
  - 新增 `cell-class-name` 属性，用于指定单元格的类名
  - 新增 `cell-style` 属性，用于指定单元格的样式
  - 新增 `header-row-class-name` 属性，用于指定表头行的类名
  - 新增 `header-row-style` 属性，用于指定表头行的样式
  - 新增 `header-cell-class-name` 属性，用于指定表头单元格的类名
  - 新增 `header-cell-style` 属性，用于指定表头单元格的样式
  - TableColumn 的 `prop` 属性支持 `object[key]` 格式
  - TableColumn 新增 `index` 属性，用于自定义索引值
- Tabs
  - 新增 `tab-position` 属性，控制选项面板内容显示的上、下、左、右四个方向 #6096
- Tag
  - 新增 `size` 属性 #7203
- TimePicker
  - TimePicker 的 `format` 新增对 AM/PM 的支持，#8620（by @firesh）
  - 可以用方向键导航，用 `Enter` 选中时间 #6050
  - 新增 `start-placeholder` 和 `end-placeholder`，用于设置范围选择时两个输入框的占位符 #7169
  - 新增 `arrow-control` 属性，提供另一种交互形式，#7438
- TimeSelect
  - 可以用 `Up`、`Down` 导航，用 `Enter` 选中时间 #6023
- Tooltip
  - Tooltip 新增 `hide-after` 属性，#6401 @ryatziv
- Tree
  - 新增 Tree 的 `renderAfterExpand` 属性，#8972
  - 子节点在首次被展开之前不进行渲染 #6257
  - 新增 `check-descendants` 属性，设置 `lazy` 模式下勾选节点时，是否完全展开整个子树 #6235
- Upload
  - 新增 Upload 的 `before-remove` 钩子方法，#8788（by @firesh）
  - 新增 `limit` 和 `on-exceed` 属性，支持对上传文件的个数进行限制，#7405
- 其他
  - 新增西班牙语文档

#### 修复
- Alert
  - 修复通过默认 slot 传递 `description` 的 Alert 错误地使用小图标的问题，#6612 @leezng
- AutoComplete
  - 修复 Autocomplete 与 Vue 2.5.x 不兼容的问题，#6942（by @rennai）
  - 修复 Autocomplete 键盘回车被阻止传播的问题，#6499 @leezng
- Button
  - 修复禁用的 Button 在点击文字部分时未阻止事件传播的问题，#6421
- Carousel
  - 修复 CarouselItem 为异步获取时被隐藏的问题，#8921
  - 修复 Carousel 在切换时幻灯片闪烁的问题，#6394
- Cascader
  - 修复 Cascader 的过滤功能在配置了 `props` 的情况下的异常问题，#7225
- Container
  - 修复当视口变窄时 Container 无法同步更新其宽度的问题，#8042
- DatePicker
  - 修复 `focus` 方法在范围选择时无效的问题，#9437
  - 修复当目前时刻处于不可选择的范围内时，点击面板上的「此刻」按钮仍能选中目前时刻的问题，#9470（by @wacky6）
  - 修复当在月选择面板中选中天数较少的月份时，日期面板呈现下一个月的问题，#9577（by @wacky6）
  - 现在 DatePicker 的 `change` 事件只会在 `value` 真正改变的时候触发，#9029（by @remizovvv）
  - 修复 DatePicker 在范围选择时 blur 事件触发时机有误的问题，#8784
  - 修复范围选择的 DatePicker `editable` 和 `readonly` 属性无法正常工作的问题，#7922
  - 修复 DatePicker 的范围选择在内核为 Chromium 53-57 的浏览器中无法使用的问题，#7838
  - 修复周模式下的 DatePicker 在选择某年第一周可能会显示为前一年第一周的问题，#7860（by @hh23485）
  - 选择周数时，`v-model` 结果返回该周第二天的问题 #6038
  - 在 `daterange` 类型中，第一次的输入会被清空的问题 #6021
  - 修复 DateTimePicker 的快捷菜单过长时，最后一项会被隐藏的问题，#7567（by @DuLinRain）
  - 修复 DatePicker 的范围选择在初始值为空数组时会报错的问题，#7233
  - 修复 DatePicker 在西半球使用时月视图和年视图禁用日期显示错误的问题，#7114
  - 修复设置了 `disabledDate` 的 DatePicker 在月视图下全部不可选的问题，#6768 @qingdengyue
  - 修复 DatePicker 的月视图错误计算禁用日期的问题，#6363
  - 修复 DatePicker 的 i18n 不支持 `amPm` 的问题，#6574
- DateTimePicker
  - 和 TimePicker 相互影响的问题 #6090
  - 选择时间小时和秒可超出限制的问题 #6076
- Dialog
  - 当含有下拉框时，下拉框的打开和关闭会造成文字虚晃的问题 #6088
- Dropdown
  - 修复当页面仅有水平滚动条时，某些浏览器下拉菜单定位错误的问题，#9138（by @banzhuanmei）
  - 修复 `show-timeout` 对点击触发的 Dropdown 无效的问题，#8734（by @presidenten）
  - 修复初始状态被禁用的 Dropdown 在取消禁用后无法弹出下拉菜单的问题，#6969
- Form
  - 修复 FormItem 的 `error` 属性初始值无效的问题，#8840
  - 修复 Form 对于 `trigger` 为 blur 的校验规则触发时机有误的问题，#8776
  - 修复带有边框的 CheckboxButton 在 Form 中高度错误的问题，#8100
  - Form 的 `validate` 方法现在能够正确地在异步校验完成后执行回调了，#7774（by @Allenice）
- Input
  - 修复 Input 的 `prepend` 或 `append` slot 中 Select 的边框颜色错误，#9089
- InputNumber
  - 修复初始输入小数点时被重置的问题，#9116
  - 在 InputNumber 的加减按钮上单击鼠标右键不再触发值的改变，#7817
- Loading
  - 修复某些情况下 Loading 不能被正确隐藏的问题，#9313
- Menu
  - 修复 Menu 在解析自定义颜色时的错误，#8153（by @zhouyixiang）
  - 修复由于 Menu 使用了未注册的 Tooltip 造成其在按需引入时报错的问题，#7995
  - 修复鼠标在折叠的 Menu 子菜单中快速移动时会将菜单收起的问题，#7579
- Pagination
  - 修复 Pagination 的 `current-change` 事件触发时机错误的问题，#7995
  - 修复 Pagination 的 jumper 中可以输入比最大页数更大的数字的问题，#6842 @huguangju
- Popover
  - 修复 `trigger` 为 manual 的 Popover 的触发问题，#8467
- Progress
  - 修复 Progress 百分比为 `0` 时的样式问题，#6551 @Kingwl
- Rate
  - Rate 的 `colors` 属性现在可以动态更新了，#6872 @lukaszb
- Table
  - 修复带有固定列的 Table 在列数据变化后固定列的个数计算错误的问题，#9188（by @kolesoffac）
  - 修复多级表头最后一列的边框不能正确显示的问题，#9326
  - 修复在 Safari 浏览器中表头错位的问题，#9327
  - 修复带有展开行的表格在展开某一行后，当表格数据更新但 `row-key` 值不变时，该行会自动收起的问题，#9462
  - 修复在一些情况下不必要的多次渲染问题，#9426
  - 修复动态改变 TableColumn 的 `width` 属性时，其宽度计算错误的问题，#9426
  - 修复按需引入 Table 时 `show-overflow-tooltip` 的 Tooltip 样式丢失的问题，#9130
  - 修复 Table 在执行 `clearSort` 后点击对应列的排序图标无法正常排序的问题，#9100（by @zEmily）
  - 修复了 Table 在固定列和合计行并存时的高度计算错误的问题，#9026
  - 修复了 Table 样式 SCSS 文件错误编译的问题，#9028
  - 修复 Table 排序图标的样式问题，#8405
  - 修复被隐藏的 Table 会造成 CPU 占用持续增加的问题，#8351
  - 修复 Table 在父元素从 `display: none` 变成其他状态时会隐藏的问题
  - 修复 Table 在父元素为 `display: flex` 时可能出现的宽度逐渐变大的问题
  - 修复 `append` 具名 slot 和固定列并存时，动态获取表格数据会导致固定列消失的问题
  - 修复 `expand-row-keys` 属性初始化无效的问题
  - 修复 `data` 改变时过滤条件失效的问题
  - 修复多级表头时固定列隐藏情况计算错误的问题
  - 修复 `max-height` 变更后无法恢复的问题
  - 修复一些样式上的计算错误
- Select
  - 修复 Select 的 `remove-tag` 事件参数与文档不符的问题，#9090
  - 修复默认尺寸的多选 Select 在清空选项后输入框高度不随之更新的问题，#8317（by @luciy）
  - 提升性能，修复组件销毁时可能导致 Vue dev-tool 卡死的问题 #6151
- Slider
  - 修复点击 Slider 的按钮会使其返回上一个位置的问题，#7190
  - 修复 Slider 由隐藏变为可见时交互错误的问题，#6593
- Steps
  - 修复在 IE 11 中的样式问题，#9454
  - 修复纵向 Steps 中最后一个 Step 的样式错误，#7980
  - 修复垂直模式的 Steps 中图标宽度的样式错误，#7891
- Tabs
  - 修复嵌套的 Tabs 的样式错误，#7941
- TimePicker
  - 修复 TimePicker 在某些情况下无法滚动的问题，#7811
  - 失去焦点时无法正确改变 `v-model` 值的问题 #6023
  - 修复 TimePicker 取消按钮无法正确取消所选值的问题，#7028
  - 修复 TimePicker 的小时数难以通过滚动的方式选中 23 时的问题，#6719 @qingdengyue
- Tooltip
  - 修复 Tooltip 无法正确切换 `disabled` 的问题，#7198
- Tree
  - 修复 Tree 的 `updateKeyChildren` 在删除子节点时的行为错误，#8100
  - 增大了 Tree 中展开箭头的点击热区，#7891
  - 修复 Tree 无法高亮 `node-key` 值为 0 的节点的问题，#6917
- Upload
  - 修复 `list-type` 为 picture-card 的 Upload 预览和删除图标丢失的问题，#7857
  - 修复 Upload 中某个文件的 `beforeUpload` 返回 `false` 时会错误地取消其他文件上传的问题，#7077
- 其他
  - 捷克语的 i18n 配置文件由 `cz` 重命名为 `cs-CZ`，#9164
  - 修复禁用文字按钮的样式问题，#8570
  - 修复上个版本引入的 Popover、Tree、Breadcrumb、Cascader 的 bug，#8188 #8217 #8283
  - 修复 clickoutside 指令的内存泄露问题，#8168 #8225（by @badpunman @STLighter）
  - 提升 Cascader、Dropdown、Message、Notification、Popover、Tooltip、Tree 的可访问性
  - 修复 RadioButton 和 CheckboxButton 的样式问题，#7793
  - 修复部分组件在按需引入时样式不完整的问题，#7811

#### 非兼容性更新
- 综合
  - 移除 `theme-default`
  - 最低兼容 Vue 2.5.2 和 IE 10
  - 表单组件的 `change` 事件和 Pagination 的 `current-change` 事件现在仅响应用户交互
  - Button 和表单组件的 `size` 属性现在可接受 `medium`、`small` 和 `mini`
  - 为了方便使用第三方图标，Button 的 `icon` 属性、Input 的 `prefix-icon` 和 `suffix-icon` 属性、Steps 的 `icon` 属性现在需要传入完整的图标类名
- Loading
  - 非全屏 Loading 遮罩层的 `z-index` 修改为 2000；全屏 Loading 遮罩层的 `z-index` 值会随页面上的弹出组件动态更新，#9522
- Dialog
  - 移除 `size` 属性。现在 Dialog 的尺寸由 `width` 和 `fullscreen` 控制
  - 移除通过 `v-model` 控制 Dialog 显示和隐藏的功能
- Rate
  - `text-template` 属性更名为 `score-template`
- Dropdown
  - `menu-align` 属性变更为 `placement`，增加更多方位属性
  - `show-timeout` 和 `hide-timeout` 属性现在仅在 trigger 为 `hover` 时生效，#9573
- Transfer
  - `footer-format` 属性更名为 `format`
- Switch
  - 由于 `on-*` 属性在 JSX 中会被识别为事件，导致 Switch 所有 `on-*` 属性在 JSX 中无法正常工作，所以 `on-*` 属性更名为 `active-*`，对应地，`off-*` 属性更名为 `inactive-*`。受到影响的属性有：`on-icon-class`、`off-icon-class`、`on-text`、`off-text`、`on-color`、`off-color`、`on-value`、`off-value`
  - `active-text` 和 `inactive-text` 属性不再有默认值
- Tag
  - `type` 属性现在支持 `success`、`info`、`warning` 和 `danger` 四个值
- Menu
  - 移除 `theme` 属性。现在通过 `background-color`、`text-color` 和 `active-text-color` 属性进行颜色的自定义
  - `collapse` 状态下的弹出菜单现在会插入至 body 元素，修复其位于 Aside 内时弹出菜单不可见的问题，#9263
- Input
  - 移除 `icon` 属性。现在通过 `suffix-icon` 属性或者 `suffix` 具名 slot 来加入尾部图标
  - 移除 `on-icon-click` 属性和 `click` 事件。现在如果需要为输入框中的图标添加点击事件，请以具名 slot 的方式添加图标
  - `change` 事件现在仅在输入框失去焦点或用户按下回车时触发，与原生 input 元素一致。如果需要实时响应用户的输入，可以使用 `input` 事件
- Autocomplete
  - 移除 `custom-item` 属性。现在通过 `scoped slot` 自定义输入建议列表项的内容
  - 移除 `props` 属性，现在使用 `value-key` 属性指定输入建议对象中用于显示的键名
- Steps
  - 移除 `center` 属性
  - 现在步骤条将默认充满父容器
- DatePicker
  - `change` 事件参数现在为组件的绑定值，格式由 `value-format` 控制
- Table
  - 移除通过 `inline-template` 自定义列模板的功能
  - `sort-method` 现在和 `Array.sort` 保持一致的逻辑，要求返回一个数字
  - 将 `append` slot 移至 `tbody` 元素以外，以保证其只被渲染一次
  - `expand` 事件更名为 `expand-change`，以保证 API 的命名一致性
  - `row-class-name` 和 `row-style` 的函数参数改为对象，以保证 API 的一致性
  - 勾选多选表格的 checkbox 时不再同时触发 `row-click` 事件，#9467

### 1.1.9
*2017-12-05*

#### 修复：
- Dynamic Form
  - 修复数字类型的字段的校验错误的问题


### 1.1.8
*2017-12-04*

#### 新特性：
- Dynamic Form
  - 增加对ui:options的支持范围，现在ui:options内可定义被动态表单组件所使用的组件的特殊属性

### 1.1.6
*2017-12-04*

#### 修复：
- Dynamic Form
  - 修改当inline属性为true，即使用行内表单模式的场合，表单项目不使用自适应

### 1.1.5
*2017-12-04*

#### 修复：
- Dynamic Form
  - 动态表单组件支持自适应。可通过设置columns属性来定义表单的列数。columns的默认值为2，分辨率在768像素以下时列数固定为1。

### 1.1.1
*2017-09-29*

#### 新特性：
- Dynamic Form
  - 新增动态表单组件
  
### 1.1.0
*2017-08-17*

#### 新特性：
- Message
  - `message` 属性支持 VNode，#5463（by @egyptik）
- ColorPicker
  - 新增 `active-change` 事件，#5775
- Popover
  - 新增 `open-delay` 属性，#5842（by @kaungmyatlwin）
- Table
  - `formatter` 新增 `value` 参数，#5709（by @haledeng）
- Tree
  - 新增 `disabled` 属性，#5937
- Menu
  - 新增 `collapse` 属性，#5941
- Select
  - 新增 `value-key` 属性，#5897
  - 新增 `clear` 事件，#5112
  - 新增 `default-first-option` 属性，#4838（by @wacky6）
- Form
  - 表示必填项的小红点现在可以动态更新了，#5403
- Autocomplete
  - 新增 `props` 属性，#5282

#### 修复：
- DatePicker
  - 部分内部文案不受 i18n 控制的问题，#5485
  - 初始值为空时，选择时间后的返回值毫秒部分不为零的问题，#5663
  - `disabledDate` 范围被扩大的问题，#4946（by @liyangworld）
  - shortcut 面板过长时的溢出问题，#5297（by @alashow）
  - 在手动输入值后按 Tab 切换焦点时下拉框不消失的问题，#5149（by @ChuckFields）
  - 部分格式化文字 i18n 不生效的问题，#6328
- Steps
  - 动态增减步骤后的样式错误，#5456（by @elfman）
  - `status` 为 `error` 的 Step 样式问题，#6155 (by @wacky6)
- Table
  - 带有固定列且可展开时，鼠标 hover 高亮行错位的问题，#5471（by @elfman）
  - 部分浏览器不支持 `classList` 的问题，#5613（by @flynntsc）
  - 异步加载数据的 Table 不显示合计行的问题，#5318
  - 带展开行的 Table 在高亮和斑马纹效果下的问题，#4871（by @mu-yu）
  - 斑马纹的 Table 的背景色在 hover 时不正确的问题，#6024（by @xtongs）
- Select
  - 单选时打开下拉框有时无法定位到已选中项的问题，#5564（by @wacky6）
  - 多选时 Vue 2.4.x 报错的问题，#5897
  - `default-first-option` 属性在远程搜索时不生效的问题，#5084
  - 修复可创建选项的 Select 在没有选项数据时不显示「无数据」文本的问题，#4977
  - 绑定值为对象类型，初始值为 null时，会选中 value 为 `0` 的问题，#6143
- Radio
  - RadioGroup 内只有一个 Radio 时的圆角丢失问题，#5646（by @YYvanYang）
- Upload
  - `auto-upload` 为 false 时，无法选择之前删除的文件的问题，#5706
  - `disabled` 时删除按钮仍可见并可操作的问题，#5841
  - 兼容 Vue 2.4 `key` 不能是对象的问题，#5872
  - 禁用的 Upload 的文件列表仍然显示删除按钮并可操作的问题，#6091
- MessageBox
  - 非 `confirm` 或 `prompt` 情况下点击取消按钮仍然被 resolve 的问题，#5658
- Rate
  - 初始值带有小数时，激活的 icon 不显示小数部分的问题，#5785
- Pagination
  - 总页数的 i18n 不与 vue-i18n@6.x 兼容的问题，#5796（by @mario56）
  - 当前页为最大页数减一时，错误地显示省略号的问题，#5861（by @openks）
  - 输入框数值与当前页不同步的问题，#5377
  - jumper 在 IE 下敲击回车无法触发翻页的问题，#6306 @qingdengyue
- Loading
  - 不可见元素绑定 Loading 时的样式错误，#5649（by @xiongzixiao）
- Cascader
  - 输入框中的文字未垂直居中的问题，#5819（by @jianzhi92）
  - `value` 为 0 的数据不能展开下一级的问题，#5172（by @Kingwl）
  - 在某些情况下下拉框的位置没有及时更新的问题，#5064
  - 当 `expand-trigger` 为 `hover` 时，点击选择条目后快速移动会再次选到父级元素的问题，#6199
- Tree
  - 在 lazy 模式下 `setCheckedKeys` 和 `setCheckedNodes` 方法的 bug，#5937
  - 在 lazy 模式下勾选父级节点会一次性加载全部后代节点的问题，#5963
  - 勾选父节点会弹出子节点的问题，#6029
  - 勾选逻辑错误，#6034
- Form
  - 未在 FormItem 上指定 `label` 时，label 的具名 slot 失效的问题，#5921
  - 行内 FormItem 对复合型 Input 失效的问题，#5151
  - FormItem 在 Firefox 中的高度与其他浏览器不一致的问题，#5152
  - 作为 Form 直接子元素的 FormItem 不继承 `label-width` 的问题，#6044
- Tooltip
  - Vue 2.4.x 下触发元素为自定义组件时不工作的问题，#5916
- Switch
  - 当页面上有被选中的文本时点击 Switch 无效的问题，#5411
  - 内部的原生 input 状态与组件不同步的问题，#6205 @wacky6
- Carousel
  - initial-index 属性无效的问题，#5334
- Dialog
  - 嵌套于 Dialog 中的 Popover 无法被 focus 的问题，#5336
  - Dialog 在滚动后，其嵌套的 Select 需多次点击才能呼出的问题，#5226
  - 提升可访问性，#4786
- ColorPicker
  - ColorPicker 的默认值有时与面板中的值不一致的问题，#5183（by @Kingwl）
  - 默认值为白色的 ColorPicker 无法通过面板改变 hue 的问题，#5184（by @Kingwl）
- InputNumber
  - 与其他表单组件同行显示时不能对齐的问题，#5127
  - 当 `size` 为 `large` 和 `small` 时的样式问题，#6310 @JeremyWuuuuu
- Autocomplete
  - 无法触发原生 `keydown` 和 `keyup` 事件的问题，#5129
  - 在 blur 时不会收起下拉框的问题，#6256
- MessageBox
  - 提升可访问性，#4786
- Menu
  - collapse 模式下的 Menu 自动弹出子菜单的问题，#6111
  - 在 collaspse 时不能收起子级菜单的问题，#6200
- Tab
  - 使用 `v-if` 的动态 TabPane 顺序错误的问题，#6066
- Slider
  - 在 resize 窗口后滑块位置不准的问题，#6263
  - 点击 Slider 的滑块会使其移动至起点的问题，#6359
- Other
  - 鼠标在 `open-delay` 时间内移开元素后，仍然会弹出 Popover 的问题，#6058（by @laobubu）

#### 非兼容性更新:
- Select
  - 值为对象类型时，需要提供一个 `value-key` 作为唯一性标识，#5897

### 1.0.21
*2017-06-14*

- Tabs 标签页
  - 新增 `before-tab-click` 属性，用于对标签页点击动作进行控制。

### 1.0.20
*2017-06-05*

- 修复Dialog 对话框内打开的对话框关闭后，遮罩层没有隐藏的问题

### 1.0.19
*2017-5-31*

- 修复Dialog 对话框在不缓存内容的场合，对话框关闭时，内容比标题先消失的问题

### 1.0.18
*2017-5-25*

- 修复当设置Select 选择器的属性disabled设置为true时，没有显示禁用样式的问题

### 1.0.17
*2017-5-25*

- 修复当设置Dialog 对话框的属性cache为false时，内容没有显示的问题
- 修正Dialog 对话框的拖拽功能，只可以通过点击Dialog 对话框的Header进行拖拽

### 1.0.16
*2017-5-25*

#### 新特性：
- 新增 Transfer 组件
- 新增 transition 的文档，现在用户可以使用内置 transition 了
- Slider 新增垂直模式，使用 `vertical` 属性即可打开，#4410（by @devange）
- CheckboxGroup 新增按钮模式，#3697（by @mdartic）
- Table
  - 新增 `setCurrentRow` 方法，#4390
  - 新增表尾合计行的功能，提供 `show-summary`、`sum-text` 和 `summary-method`，#4484
  - TableColumn 新增 `filter-placement` 属性，#4491
- Dialog
  - 新增 `before-close` 属性，#4432
  - 新增 `visible` 属性，且支持 `.sync` 修饰符，#4539
- Upload
  - 新增 `disabled` 属性，#4473
  - `on-change` 事件现在也会在添加文件后触发，#4447
  - 新增 `abort` 方法，#4575
- Switch 新增 `on-value` 和 `off-value` 属性，支持自定义两种状态的值，#4403
- DatePicker
  - 新增 `default-value` 属性，用于设定下拉框初次弹出时显示的日期，#4222（by @wacky6）
  - 支持动态改变 `type`，#4417（by @coffeedeveloper）
- CarouselItem 新增 `label` 属性，#4317（by @paul-blundell）
- MessageBox 的 `message` 属性增加对 VNode 的支持，#4550
- Pagination 的 `current-page` 增加对 `.sync` 的支持，#4539
- Form 新增名为 label 的 slot，用于自定义标签文本的内容，#4634
- 新增 Dropdown 的 `visible-change` 事件，#4818（by @luciy）
- 新增 Col 和 Row 的 `tag` 属性，#4799
- 新增 Cascader 的 `before-filter` 属性，#4774
- 新增 InputNumber 的 `debounce` 属性，#4712（by @pengchongfu）

#### 修复：
- Select 和 Table 的某些功能与 Vue 2.3.x 不兼容的问题，#4518
- DatePicker 的 `disabledDate` 对手动在输入框中输入的值无效的问题，#4309
- Tree 的树节点 ID 为数字 0 时的一些问题，#4415
- TimePicker 在完成选择后数字不居中显示的问题，#4425（by @pengchongfu）
- Autocomplete 在输入中文时频繁触发搜索方法的问题，#4393（by @qazbnm456）
- Upload
  - 不能选择同一个文件的问题，#4461
  - `auto-upload` 为 false 时不显示预览图片的问题，#4572
  - 一些样式问题，#4643
- 嵌套在 FormItem 中的按钮样式的 RadioGroup 的样式问题，#4336
- ColorPicker 修复将绑定值赋值为空不会清空颜色面板的问题，#4668（by @pengchongfu）
- Table 修复在 Safari 下 `show-overflow-tooltip` 无效的问题，#4157（by @renxia）
- 修复上个版本中 Cascader 搜索功能不可用的问题，#4812
- 修复 `type` 为 range 的 DatePicker 错误地触发 watch 的问题，#4837（by @wacky6）
- 修复 TimePicker 在某些浏览器上数字不居中的问题，#4847（by @pengchongfu）
- 修复当按下 ESC 关闭 Dialog 时不触发 `before-close` 钩子的问题，#4819（by @patriciussanctus）
- 修复当多个 MessageBox 中存在 VNode 格式的 `message` 时渲染不正确的问题
- 修复按下 tab 键无法使 Checkbox 获得焦点的问题
- 修复在按需引入某些组件时，报 `el-collapse-transition` 未找到的错，#4728
- 修复 Pagination 在 FireFox 中的垂直居中问题，#4756
- 修复 `type` 为 week 时的 DatePicker 在更新绑定值后面板视图不更新的问题，#4739
- 修复 `show-summary` 的 Table 的一些高度计算错误，#4736
- 修复 Autocomplete 输入中文时会清空输入框的问题，#4718
- 修复异步获取数据的 Table 的合计行不随表格其余部分滚动的问题，#4717
- 修复 `close-on-press-esc` 为 true 的 Dialog 在按下 ESC 时无法正确关闭的问题，#4706
- 修复设置了 `on-value` 和 `off-value` 的 Switch `change` 事件参数不正确的问题，#4675

#### 非兼容性更新:
- 最低兼容 Vue 2.3.0

### 1.0.15
*2017-5-24*

- Dialog:增加拖拽功能

### 1.0.13
*2017-5-18*

- Form:修改在没有指定rules的场合，submit事件没有触发的问题

### 1.0.12
*2017-05-11*

- 修正在firefox下Dialog显示不正确的问题。(flex box)

### 1.0.11
*2017-05-11*

- Dialog 对话框调整： 不设置Dialog的Top属性的场合，相对于浏览器窗口垂直居中。

### 1.0.10
*2017-05-05*

- 日期时间选择器／时间选择器支持通过设定format来控制显示／不显示秒选取器
- 日期选择器增加format属性
