//服务器三环境模式(1:dev, 2:beta, 3:prd)
const serverEnv = SERVER_ENV;

//ddm服务器地址
const ddmServer = [
	{tag: 'DDM', env: 'DEV', host: 'http://localhost:8080', version: '1.1.0'},
	{tag: 'DDM', env: 'BETA', host: 'http://ddm-1-0-0.ip2fw-ms.gantcloud.com/ddm-server', version: '1.1.0'},
	{tag: 'DDM', env: 'PRD', host: '/ddm-server', version: '1.1.0'},
];

//websocket服务器地址
const wsServer = [
	{tag: 'WEBSOCKET', env: 'DEV', host: 'ws://localhost:8080/websocket', version: '1.1.0'},
	{tag: 'WEBSOCKET', env: 'BETA', host: 'ws://ddm-1-0-0.ip2fw-ms.gantcloud.com/websocket', version: '1.1.0'},
	{tag: 'WEBSOCKET', env: 'PRD', host: window.realHost.replace('http', 'ws') + '/websocket', version: '1.1.0'},
];

export default {
	ddmServer: ddmServer[serverEnv - 1],
	wsServer: wsServer[serverEnv - 1],
}