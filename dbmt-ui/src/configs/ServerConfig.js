//服务器三环境模式(1:dev, 2:beta, 3:prd)
const serverEnv = SERVER_ENV;

//dbmterver服务器地址
const dbmterver = [
	{tag: 'DBMT', env: 'DEV', host: 'http://localhost:8080', version: '1.0.0'},
	{tag: 'DBMT', env: 'BETA', host: 'http://localhost:8080', version: '1.0.0'},
	{tag: 'DBMT', env: 'PRD', host: '/dbmt-server', version: '1.0.0'},
];


export default {
	dbmterver: dbmterver[serverEnv - 1],
}