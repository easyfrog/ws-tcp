const net = require("net");
const signal = require('../lib/signal')
const utils = require('../lib/utils')
const config = require('../config')

module.exports = function () {
    // TCP server
    const tcpServer = net.createServer((socket) => {
        socket.uuid = 'tcp-' + utils.getUUID()

        // 接收到的数据
        socket.on("data", (data) => {
            var str = data.toString()
            console.log(`${socket.uuid}:`, str);

            // emit a message event
            signal.emit('message', str)

            // 将消息返回
            socket.write('echo: ' + str);
        });

        // 当连接结束时
        socket.on("end", () => {
            console.log(`${socket.uuid} is disconnect.`);
        });
    });

    tcpServer.listen(config.tcp_port, () => {
        console.log("tcp server is running", config.tcp_port)
    })

    return tcpServer
}
