/*
 使用socketIO进行服务端与客户端（浏览器）通信的测试文件
 */

// 引入客户端
import io from 'socket.io-client'

// 连接服务端，得到客户端与服务端连接的socket对象
const socket = io('ws://localhost:4000')

// 绑定receiveMsg监听，接收服务端发送的消息
socket.on('receiveMsg', function (data) {
  console.log('服务端发送消息给客户端', data)
})

// 向客户端发送消息
socket.emit('sendMsg', {name: 'Tom', date: Date.now()})
console.log('客户端发送消息给服务端', {name: 'Tom', date: Date.now()})