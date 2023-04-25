import mockjs from 'mockjs';

const getUserInfo = (req, res) =>
  res.json({
    operator: {
      token: 'token',
      versionNo: 0,
      user: {
        userId: 0,
        userType: 1,
        userCode: '1',
        userName: 'gant-arch',
        realName: '甘棠架构',
        mobile: '138XXXX4625',
        email: 'XXXX@163.com',
        gender: 1,
        userRoleList: []
      },
      teamList: []
    }
  });

  const getDictInfo = (req, res) =>
  res.json({
    moduleList: [],
    roleList: [],
    teamList: []
  });

export default {
  'POST /external/account/login': getUserInfo,
  'POST /external/dict/load-detail': getDictInfo,
};
