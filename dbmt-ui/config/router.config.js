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
        name: 'ddm-dashbord',
        icon: 'solution',
        component: './Ddm/DdmDashbord/DdmDashbordMain',
      },
      {
        path: '/instance',
        name: 'ddm-instance',
        icon: 'solution',
        component: './Ddm/DdmInstance/DdmInstanceMain',
      },    
      {
        path: '/customized-instance',
        name: 'ddm-customized-instance',
        icon: 'solution',
        component: './Ddm/DdmCustomizedInstance/DdmCustomizedInstanceMain',
      },                 
      {
        path: '/policy',
        name: 'ddm-policy',
        icon: 'solution',
        component: './Ddm/DdmPolicy/DdmPolicyMain',
      },      
 
      {
        path: '/sink',
        name: 'ddm-sink',
        icon: 'solution',
        component: './Ddm/DdmSink/DdmSinkMain',
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
            component: './Demo/DemoBizcache/DemoBizcacheMain',
          }
        ]
      },                            
    ],
  },

];
