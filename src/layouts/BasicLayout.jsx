/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import {
  Icon
} from 'antd';
import ProLayout from '@ant-design/pro-layout';
import React, {useEffect} from 'react';
import Link from 'umi/link';
import {connect} from 'dva';
import {formatMessage,getLocale} from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {isAntDesignPro} from '@/utils/utils';
import styles from './BasicLayout.less'
import classNames from 'classnames';
import logo from '../assets/logo.png';
import SocketIo from "@/websocket/SocketIo";
import VersionJson from '../../version.json'
/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = {...item, children: item.children ? menuDataRender(item.children) : []};
    return Authorized.check(item.authority, localItem, null);
  });


// 自定义Footer 不知道官方怎么用...
const GlobalFooter = ({className, links, copyright}) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <footer className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a
              key={link.key}
              title={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </footer>
  );
};

const links = [
  // {
  //   key: '帮助',
  //   title: '帮助',
  //   href: '',
  // },
  // {
  //   key: 'github',
  //   title: <Icon type="github"/>,
  //   href: 'https://github.com/ant-design/ant-design-pro',
  //   blankTarget: true,
  // },
  // {
  //   key: '条款',
  //   title: '条款',
  //   href: '',
  //   blankTarget: true,
  // },
];
const copyright = (
  <div>
    Copyright <Icon type="copyright"/> QLData     Version: V{VersionJson['v']}
  </div>
);
const footerRender = (_, defaultDom) => {

  return (
    <GlobalFooter links={links} copyright={copyright}/>
  );
  // if (!isAntDesignPro()) {
  //   return defaultDom;
  // }
  //
  // return (
  //   <>
  //     {defaultDom}
  //     <div
  //       style={{
  //         padding: '0px 24px 24px',
  //         textAlign: 'center',
  //       }}
  //     >
  //       <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
  //         <img
  //           src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
  //           width="82px"
  //           alt="netlify logo"
  //         />
  //       </a>
  //     </div>
  //   </>
  // );
};

const BasicLayout = props => {
  const {dispatch, children, settings} = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }

    // open close socket
    SocketIo.openSocketWitchDispatch(dispatch)
    return ()=> {
      console.log('BasicLayout useEffect clear! closeSocket')
      SocketIo.closeSocket()
    };

  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  return (
    <ProLayout
      logo={logo}
      title={formatMessage({id:'app.name'})}
      locale={getLocale()}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({global, settings}) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
