import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    Routes: [require('../Authorized').default],
    routes: [
      {
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/pages/User/models/register.js').then(
                  m => {
                    return { namespace: 'register', ...m.default };
                  },
                ),
              ],
              component: () => import('../User/Login'),
              LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    routes: [
      {
        path: '/',
        name: 'ddm-dashbord',
        icon: 'solution',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Ddm/DdmDashbord/DdmDashbordMain'),
              LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../Ddm/DdmDashbord/DdmDashbordMain').default,
        exact: true,
      },
      {
        path: '/instance',
        name: 'ddm-instance',
        icon: 'solution',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Ddm/DdmInstance/DdmInstanceMain'),
              LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../Ddm/DdmInstance/DdmInstanceMain').default,
        exact: true,
      },
      {
        path: '/customized-instance',
        name: 'ddm-customized-instance',
        icon: 'solution',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import('../Ddm/DdmCustomizedInstance/DdmCustomizedInstanceMain'),
              LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../Ddm/DdmCustomizedInstance/DdmCustomizedInstanceMain')
              .default,
        exact: true,
      },
      {
        path: '/policy',
        name: 'ddm-policy',
        icon: 'solution',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Ddm/DdmPolicy/DdmPolicyMain'),
              LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../Ddm/DdmPolicy/DdmPolicyMain').default,
        exact: true,
      },
      {
        path: '/sink',
        name: 'ddm-sink',
        icon: 'solution',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Ddm/DdmSink/DdmSinkMain'),
              LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../Ddm/DdmSink/DdmSinkMain').default,
        exact: true,
      },
      {
        name: 'demo',
        icon: 'solution',
        hideInMenu: false,
        routes: [
          {
            path: '/demo/bizcache',
            name: 'demo-bizcache',
            icon: 'solution',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import('../Demo/DemoBizcache/DemoBizcacheMain'),
                  LoadingComponent: require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../Demo/DemoBizcache/DemoBizcacheMain').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/home/taozhen/repo/git_repo/gantang/ddm/ddm-1.1.0/ddm-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
