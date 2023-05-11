export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {path: '/user/login', component: './User/Login'},
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        name: 'dbmt-connection-config',
        icon: 'solution',
        component: './Dbmt/DbmtConnectionConfig/DbmtConnectionConfigMain',
      },
      // {
      //   path: '/backup-restore',
      //   name: 'dbmt-backup-restore',
      //   icon: 'solution',
      //   component: './Dbmt/DbmtBackupRestore/DbmtBackupRestoreMain',
      // },                                         
    ],
  },

];
