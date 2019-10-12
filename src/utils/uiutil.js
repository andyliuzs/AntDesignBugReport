import Link from 'umi/link';
import React from "react";
import _ from 'lodash'

// breadcrumb itemRender
const breadcrumbItemRender = (route, params, routes, paths) => {
  const last = routes.indexOf(route) === routes.length - 1;
  // if path is home, use Link。
    // 原版 <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
  if (route.path === '/') {
    return <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
  }
  // if(_.indexOf(routes,route)===0){
  //   return <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
  // }
  //  console.log('routes',route,last,route.component,paths)
  return last || !route.component ? (
    <span>{route.breadcrumbName}</span>
  ) : (

    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
};
export {breadcrumbItemRender as itemRender}
