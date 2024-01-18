const express =  require('express')
const mongoose = require('mongoose') //mongo db library
const cors = require('cors') //Cors will let us accept cross origin request from our frontend to backend.
const helmet = require('helmet')
const app = express()
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(cors())

//routes with files
// const authRoute = require('./routes/auth.js')
// const userRoute = require('./routes/users.js')
// const postRoute = require('./routes/posts.js')
// app.use('/auth', authRoute)
// app.use('/users', userRoute) 
// app.use('/posts', postRoute)


// const Chatroom = require('./moedls/chatroom')

//get all the chats of a specified room
// app.get('/:roomid', async(req, res) => {
//     try {
//         const { roomid } = req.params
//         const result = await Chatroom.findById(roomid)
//         res.status(200).json({ 'array' : result.chats})
//     } 
//     catch (error) {
//         res.status(404).json({ 'msg' : error.message })
//     }
// })

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
}))


// socket configuration for chatting -----------------------------------------------------------------------
const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server( server, {
    cors : {
        origin : 'http://localhost:3000',
        methods : ["GET", "POST", "PATCH"],
    },
})

//io listning to the events...socket coming from the client's end
// io.on("connection", (socket) => {
//     console.log(`user conected on socket ${socket.id}`)

//     //socket waiting for occuer join_room event that emit from the client's end
//     socket.on('join_room', (roomId) => {
//         socket.join(roomId)
//         console.log(`user with id ${socket.id} joind to room with id ${roomId}`);
//     })

//     //socket waiting for a client send a message
//     socket.on("send_message", async(messageContainer) => {
//         //trigger the receive message event in the client end..and send the message to the relavant room
//         const currentRoom = await Chatroom.findById(messageContainer.room)
//         currentRoom.chats.push(messageContainer.msg)
//         currentRoom.save()
//         socket.to(messageContainer.room).emit('receive_message', messageContainer)
//     })

//     //when disconnected from the socket
//     socket.on("disconnect", () => {
//         console.log(`user disconnected from socket ${socket.id}`);
//     })
// })

// ..............................


//mongo setup
mongoose.set('strictQuery', true)
mongoose
    .connect('mongodb+srv://chamalkaMarasinghe:8tqhT1RE8APcKZv6@cluster0.tjh57ad.mongodb.net/recipe_app?retryWrites=true&w=majority')
    .then(() => {
        server.listen(3001, () => {console.log(`server running on port ${3001}`);})
    })
    .catch((err) => {console.log(err);})