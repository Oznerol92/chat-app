var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const { Server } = require("socket.io");

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

var socketListener = express()
var http = require('http');
const socketListenerServer = http.createServer(socketListener)
const io = new Server(socketListenerServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log("New client connected")

    // receive a message from the client
    socket.on("message", ({sentBy, text}) => {
        io.emit("message", {sentBy, text})
    })
    getApiAndEmit(socket)
})

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
}

socketListenerServer.listen(5001, () => {
    console.log('listening on *:5001');
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public/build')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app
