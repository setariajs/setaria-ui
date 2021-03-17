/* Automatically generated by './build/bin/build-entry.js' */

import Pagination from '../packages/pagination/index.js';
import Dialog from '../packages/dialog/index.js';
import Autocomplete from '../packages/autocomplete/index.js';
import Dropdown from '../packages/dropdown/index.js';
import DropdownMenu from '../packages/dropdown-menu/index.js';
import DropdownItem from '../packages/dropdown-item/index.js';
import Menu from '../packages/menu/index.js';
import Submenu from '../packages/submenu/index.js';
import MenuItem from '../packages/menu-item/index.js';
import MenuItemGroup from '../packages/menu-item-group/index.js';
import Input from '../packages/input/index.js';
import InputNumber from '../packages/input-number/index.js';
import Radio from '../packages/radio/index.js';
import RadioGroup from '../packages/radio-group/index.js';
import RadioButton from '../packages/radio-button/index.js';
import Checkbox from '../packages/checkbox/index.js';
import CheckboxButton from '../packages/checkbox-button/index.js';
import CheckboxGroup from '../packages/checkbox-group/index.js';
import Switch from '../packages/switch/index.js';
import Select from '../packages/select/index.js';
import Option from '../packages/option/index.js';
import OptionGroup from '../packages/option-group/index.js';
import Button from '../packages/button/index.js';
import ButtonGroup from '../packages/button-group/index.js';
import Table from '../packages/table/index.js';
import TableColumn from '../packages/table-column/index.js';
import DatePicker from '../packages/date-picker/index.js';
import TimeSelect from '../packages/time-select/index.js';
import TimePicker from '../packages/time-picker/index.js';
import Popover from '../packages/popover/index.js';
import Tooltip from '../packages/tooltip/index.js';
import MessageBox from '../packages/message-box/index.js';
import Breadcrumb from '../packages/breadcrumb/index.js';
import BreadcrumbItem from '../packages/breadcrumb-item/index.js';
import Form from '../packages/form/index.js';
import FormItem from '../packages/form-item/index.js';
import Tabs from '../packages/tabs/index.js';
import TabNav from '../packages/tab-nav/index.js';
import TabPane from '../packages/tab-pane/index.js';
import Tag from '../packages/tag/index.js';
import Tree from '../packages/tree/index.js';
import Alert from '../packages/alert/index.js';
import Notification from '../packages/notification/index.js';
import Slider from '../packages/slider/index.js';
import Loading from '../packages/loading/index.js';
import Icon from '../packages/icon/index.js';
import Row from '../packages/row/index.js';
import Col from '../packages/col/index.js';
import Upload from '../packages/upload/index.js';
import Progress from '../packages/progress/index.js';
import Spinner from '../packages/spinner/index.js';
import Message from '../packages/message/index.js';
import Badge from '../packages/badge/index.js';
import Card from '../packages/card/index.js';
import Rate from '../packages/rate/index.js';
import Steps from '../packages/steps/index.js';
import Step from '../packages/step/index.js';
import Carousel from '../packages/carousel/index.js';
import Scrollbar from '../packages/scrollbar/index.js';
import CarouselItem from '../packages/carousel-item/index.js';
import Collapse from '../packages/collapse/index.js';
import CollapseItem from '../packages/collapse-item/index.js';
import Cascader from '../packages/cascader/index.js';
import ColorPicker from '../packages/color-picker/index.js';
import Transfer from '../packages/transfer/index.js';
import Container from '../packages/container/index.js';
import Header from '../packages/header/index.js';
import Aside from '../packages/aside/index.js';
import Main from '../packages/main/index.js';
import Footer from '../packages/footer/index.js';
import JsonForm from '../packages/json-form/index.js';
import TemplateBaseSearch from '../packages/template-base-search/index.js';
import SimplePagination from '../packages/simple-pagination/index.js';
import List from '../packages/list/index.js';
import ListItem from '../packages/list-item/index.js';
import ListItemMeta from '../packages/list-item-meta/index.js';
import JsonViewer from '../packages/json-viewer/index.js';
import Divider from '../packages/divider/index.js';
import CardActionItem from '../packages/card-action-item/index.js';
import CardMeta from '../packages/card-meta/index.js';
import Avatar from '../packages/avatar/index.js';
import Timeline from '../packages/timeline/index.js';
import TimelineItem from '../packages/timeline-item/index.js';
import Link from '../packages/link/index.js';
import Image from '../packages/image/index.js';
import Calendar from '../packages/calendar/index.js';
import Backtop from '../packages/backtop/index.js';
import InfiniteScroll from '../packages/infinite-scroll/index.js';
import PageHeader from '../packages/page-header/index.js';
import CascaderPanel from '../packages/cascader-panel/index.js';
import Drawer from '../packages/drawer/index.js';
import Popconfirm from '../packages/popconfirm/index.js';
import Ellipsis from '../packages/ellipsis/index.js';
import QueryFilter from '../packages/query-filter/index.js';
import Description from '../packages/description/index.js';
import TagSelect from '../packages/tag-select/index.js';
import TagSelectItem from '../packages/tag-select-item/index.js';
import Statistics from '../packages/statistics/index.js';
import ProForm from '../packages/pro-form/index.js';
import ProTable from '../packages/pro-table/index.js';
import QueryCriteriaForm from '../packages/query-criteria-form/index.js';
import locale from 'setaria-ui/src/locale';
import CollapseTransition from 'setaria-ui/src/transitions/collapse-transition';
import eventManager from 'setaria-ui/src/mixins/event-manager';

const components = [
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabNav,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  JsonForm,
  TemplateBaseSearch,
  SimplePagination,
  List,
  ListItem,
  ListItemMeta,
  JsonViewer,
  Divider,
  CardActionItem,
  CardMeta,
  Avatar,
  Timeline,
  TimelineItem,
  Link,
  Image,
  Calendar,
  Backtop,
  PageHeader,
  CascaderPanel,
  Drawer,
  Popconfirm,
  Ellipsis,
  QueryFilter,
  Description,
  TagSelect,
  TagSelectItem,
  Statistics,
  ProForm,
  ProTable,
  QueryCriteriaForm,
  CollapseTransition
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;
  Vue.mixin({
    ...eventManager
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.5.22',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabNav,
  TabPane,
  Tag,
  Tree,
  Alert,
  Notification,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Message,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  JsonForm,
  TemplateBaseSearch,
  SimplePagination,
  List,
  ListItem,
  ListItemMeta,
  JsonViewer,
  Divider,
  CardActionItem,
  CardMeta,
  Avatar,
  Timeline,
  TimelineItem,
  Link,
  Image,
  Calendar,
  Backtop,
  InfiniteScroll,
  PageHeader,
  CascaderPanel,
  Drawer,
  Popconfirm,
  Ellipsis,
  QueryFilter,
  Description,
  TagSelect,
  TagSelectItem,
  Statistics,
  ProForm,
  ProTable,
  QueryCriteriaForm
};
