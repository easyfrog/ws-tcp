const WebSocket = require('ws');
const signal = require('../lib/signal')
const utils = require('../lib/utils')
const config = require('../config')

let server

function sendMessage(msg, type='echo') {
    if (!server) {
        return
    }

    //6.3把消息广播所有客户端：clients表示所有客户端
    server.clients.forEach(function (client) {
        //若某个客户端是打开的，就把消息广播给该客户
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type,
                message: msg
            }));
        }
    })
}

// 当收到message事件时
signal.on('message', msg => {
    sendMessage(msg, 'signal')
})

module.exports = function () {

    //创建WebSocket服务器
    server = new WebSocket.Server({ port: config.ws_port });

    //绑定open事件
    server.on('open', () => {
        console.log('websocket服务', config.ws_port)
    })

    //绑定close事件
    server.on('close', () => {
        console.log('关闭ws服务')
    })

    //6、绑定connection事件 ws参数表示客户端 req表示客户端的请求信息
    server.on('connection', (socket, req) => {
        //6.1获取客户端的ip port
        const ip = req.connection.remoteAddress;
        const port = req.connection.remotePort;

        var uuid = 'ws-' + utils.getUUID()

        const clientName = ip + port;
        console.log(`${clientName} is connect, id: ${uuid}`);

        //6.2向客户端发送消息
        socket.send(JSON.stringify({
            type: 'echo',
            message: 'hello' + clientName
        }));

        // 接收信息
        socket.on('message', msg => {
            console.log(`${clientName}:${uuid} : ${msg}`);
            sendMessage(msg)
        })
    })

    return server
}

