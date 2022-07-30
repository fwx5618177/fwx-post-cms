/**
 * 中文的多语言
 */

const backgroundSide = {
    layoutBg: '背景布局',
}

const dashboardSideMenu = {
    defaultMain: '默认主页',
    defaultOps: '默认工作台',
    sidemenu: '菜单',
    charts: '图标',
    'charts.s2': '动态图表展示',
}

const menuSideForm = {
    routemenushow: '主题背景设置',
    routebgshowstatus: '是否设置背景',
    routekey: '路由关键字',
    routelabel: '路由名',
    routepath: '路由路径',
    routeicon: '路由图标',
    routeindex: '路由顺序',
    routechild: '子路由',
    routecomponent: '路由组件',
    routeoutlet: '路由是否可点击',
    routecasesensitive: '大小写确认',
    'button.submit': '提交',
    'button.reset': '重置',
    'routebgshowstatus.text': '请选择背景设置的状态',
    'routemenushow.text': '请输入主题背景设置的值!',
    'routekey.text': '请输入路由关键字的值(key)',
    'routelabel.text': '请输入路由名(label)',
    'routepath.text': '请输入路由路径(path)',
    'routeicon.text': '请输入路由图标(icon)',
    'routeindex.text': '请输入路由顺序(index)',
    'routechild.text': '请输入子路由(children)',
    'routecomponent.text': '请输入路由组件',
    'routeoutlet.text': '请输入路由是否可点击',
    'routecasesensitive.text': '请输入大小写确认',
    'routebadge.ribbon': '路由配置',
    'routebadge.ribbonshow': '路由表展示',
    'routecard.text': '路由表设置',
    'routetable.treedata': '现存路由表',
    'routetable.switch': '展开',
    'routeoutlet.text.radio.status.start': '是',
    'routeoutlet.text.radio.status.close': '否',
    'routecasesensitive.radio.status.start': '开启',
    'routecasesensitive.radio.status.close': '关闭',
}

const chartsContext = {
    's2table.header.title': '动态表格',
}

export const zh_menu = {
    info: '信息',
    blog: '博客',
    resume: '简历',
    contact: '联系',
    ...backgroundSide,
    ...dashboardSideMenu,
    ...menuSideForm,
    ...chartsContext,
}
