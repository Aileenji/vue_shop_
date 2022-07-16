import Vue from "vue";
import {
    Form,
    FormItem,
    Input,
    Button,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Submenu,
    Menu,
    MenuItem,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    Popconfirm,
    Tag,
    Divider,
    MessageBox,
    Tree,
    Select,
    Option
} from 'element-ui';


Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm