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
        name: 'dbmt-dashbord',
        icon: 'solution',
        component: './Dbmt/DbmtConnectionConfig/DbmtConnectionConfigMain',
      },
      {
        path: '/connection-config',
        name: 'dbmt-connection-config',
        icon: 'solution',
        component: './Dbmt/DbmtConnectionConfig/DbmtConnectionConfigMain',
      },    
      {
        path: '/backup-config',
        name: 'dbmt-backup-config',
        icon: 'solution',
        component: './Dbmt/DbmtBackupConfig/DbmtBackupConfigMain',
      },                                     
    ],
  },

];
