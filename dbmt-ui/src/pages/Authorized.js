import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import Exception from '@/components/Exception';
import { matchRoutes } from 'react-router-config';
import uniq from 'lodash/uniq';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import pageCommon from '../commons/PageCommon';

let Authorized = RenderAuthorized([]);

export default ({ children, route, location }) => {
  const routes = matchRoutes(route.routes, location.pathname);
  let authorities = [];
  // 初始化carryObject
  pageCommon.initCarryObject();
  // // 检查版本
  // pageCommon.checkVersion(location.pathname);
  // // 检查token
  pageCommon.checkToken(location.pathname);
  
  // 获取角色列表
  // let roleArray = pageCommon.loadRoleArray();
  let roleArray = [];
  Authorized = RenderAuthorized(roleArray);

  routes.forEach(item => {
    if (Array.isArray(item.route.authority)) {
      authorities = authorities.concat(item.route.authority);
    } else if (typeof item.route.authority === 'string') {
      authorities.push(item.route.authority);
    }
  });
  const noMatch = (
    <Exception
      type="403"
      desc={formatMessage({ id: 'app.exception.description.403' })}
      linkElement={Link}
      backText={formatMessage({ id: 'app.exception.back' })}
    />
  );
  return (
    <Authorized
      authority={authorities.length === 0 ? undefined : uniq(authorities)}
      noMatch={noMatch}
    >
      {children}
    </Authorized>
  );
};
