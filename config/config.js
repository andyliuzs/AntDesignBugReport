import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import serverConfig, {getSocketServerUrl} from './serverConfig';
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const {pwa, primaryColor} = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const {ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION} = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      // pwa: pwa
      //   ? {
      //     workboxPluginMode: 'InjectManifest',
      //     workboxOptions: {
      //       importWorkboxFrom: 'local',
      //     },
      //   }
      //   : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // // dll features https://webpack.js.org/plugins/dll-plugin/
      // // dll: {
      // //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      // //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  //不使用google统计
  // plugins.push([
  //   'umi-plugin-ga',
  //   {
  //     code: 'UA-72788897-6',
  //   },
  // ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  history: 'hash',
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [

    {
      path: '/exception',
      routes: [
        {
          path: '/exception/exception403',
          component: './Exception/exception403',
        },
        {
          path: '/exception/exception404',
          component: './Exception/exception404',
        },
        {
          path: '/exception/exception500',
          component: './Exception/exception500',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          redirect: '/devicemanage',
        },
        {
          name: 'deviceManage',
          path: '/devicemanage',
          icon: 'icon-shebeiguanli',
          component: './DeviceManage/Routes',
          routes: [
            {
              path: '/deviceList',
              name: 'dmDevice',
              hideInMenu: true,
              component: './DeviceManage/DeviceList',
            },
            {
              path: '/add',
              name: 'dmAddDevice',
              hideInMenu: true,
              component: './DeviceManage/AddDevice',
            },
            {
              path: '/manage',
              name: 'dmManage',
              hideInMenu: true,
              component: './DeviceManage/Manage',
            },
            {
              path: '/details',
              name: 'dmDetails',
              hideInMenu: true,
              component: './DeviceManage/Details',
            },
          ],
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/socket.io/': {
      target: serverConfig.getSocketServerUrl(),
      changeOrigin: true,
      ws: true,
      secure: false,
      logLevel: 'debug', // pathRewrite: { '^/server': '' },
    },
    '/search': {
      target: `${serverConfig.getServerUrl()}/`,
      changeOrigin: true,
    },
    '/api/': {
      target: `${serverConfig.getServerUrl()}/`,
      changeOrigin: true,
    },
    '/v1/api/': {
      target: `${serverConfig.getServerUrl()}/`,
      changeOrigin: true,
    },
    '/v2/api/': {
      target: `${serverConfig.getServerUrl()}/`,
      changeOrigin: true,
    },
  },
};
