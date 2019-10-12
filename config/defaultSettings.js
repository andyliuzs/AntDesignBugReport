import manifest from '../src/manifest'
export default {
  navTheme: 'dark',
  primaryColor: '#1890FF',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: true,
  },
  //title:  ['name'], 由于antdesign pro bug 如果想国际化名称则不要通过这里设置左上角名称
  pwa: false,
  iconfontUrl: './assets/icon/icon_menus.js',
};
