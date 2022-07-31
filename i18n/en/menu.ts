/**
 * En
 */

const backgroundSide = {
    layoutBg: 'Background layout',
}

const dashboardSideMenu = {
    defaultMain: 'Default Main Page',
    defaultOps: 'Default Work',
    sidemenu: 'Menu',
    charts: 'Charts',
    'charts.s2': 'Dynamic Charts',
    'charts.x6': 'Flow',
    'charts.ava': 'Dynamic Charts',
    'charts.l7': '3D Charts',
}

const menuSideForm = {
    routemenushow: 'backgroundset',
    routebgshowstatus: 'set new background',
    routekey: 'route key',
    routelabel: 'route name',
    routepath: 'route path',
    routeicon: 'route icon',
    routeindex: 'route sequence',
    routechild: 'child',
    routecomponent: 'components',
    routeoutlet: 'outlet',
    routecasesensitive: 'case sensitive',
    routepagelevel: 'route page level',
    'button.submit': 'submit',
    'button.reset': 'reset',
    'routemenushow.text': 'Please input!',
    'routekey.text': 'Please input!',
    'routelabel.text': 'Please input!',
    'routepath.text': 'Please input!',
    'routeicon.text': 'Please input!',
    'routeindex.text': 'Please input!',
    'routechild.text': 'Please input!',
    'routepagelevel.text': 'Please input!',
    'routecomponent.text': 'Please input!',
    'routeoutlet.text': 'Please input!',
    'routecasesensitive.text': 'Please input!',
    'routebadge.ribbon': 'route conf',
    'routebadge.ribbonshow': 'Route Show',
    'routecard.text': 'Route Setting',
    'routetable.treedata': 'Route Tree Data',
    'routetable.switch': 'Expand',
    'routeoutlet.text.radio.status.start': 'Yes',
    'routeoutlet.text.radio.status.close': 'No',
    'routecasesensitive.radio.status.start': 'Start',
    'routecasesensitive.radio.status.close': 'Close',
}

const chartsContext = {
    's2table.header.title': 'Dynamic Table',
    'x6flow.header.title': 'X6 Flow',
    'ava.header.title': 'Automatical Chart',
    'charts.header.title': '3D Charts',
}

export const en_menu = {
    info: 'Info',
    blog: 'Blog',
    resume: 'Resume',
    contact: 'Contact',
    ...backgroundSide,
    ...dashboardSideMenu,
    ...menuSideForm,
    ...chartsContext,
}
