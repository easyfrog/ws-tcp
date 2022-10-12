const createTCPServer = require('./servers/tcp')
const createWSServer = require('./servers/ws')

// 创建 WS 服务
var ws_server = createWSServer()

// 创建 TCP 服务
var tcp_server = createTCPServer()