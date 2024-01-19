const express =  require('express')
const mongoose = require('mongoose')
const cors = require('cors') 
const helmet = require('helmet')
const app = express()
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(cors())

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

//notification schema for database operations ---------------------------------------------------------------
const NotificationSchema = mongoose.model('Notification', 
    mongoose.Schema({
        msg : {
            type : String,
            required : true,
        },
        dateCreated : {
            type : Date,
            required : true,
        }
    })
);

// retriveing all notifications -------------------------------------------------------------------------------
app.get("/notifications/:lastUpdatedDate", async(req, res) => {
    const { lastUpdatedDate } = req.params;
    const lastUpdatedDateObject = new Date(lastUpdatedDate);
    const notifications = await NotificationSchema.find({dateCreated: {$gt: lastUpdatedDateObject}});
    res.status(200).json({data : notifications}); 
});

// socket communication events --------------------------------------------------------------------------------
io.on("connection", (socket) => {

    socket.on("send", async({msg}) => {
        await NotificationSchema.create({msg : msg, dateCreated : new Date()});
        io.emit("get", {msg : msg, dateCreated : new Date()});
    })
})

//mongo setup ---------------------------------------------------------------------------------------------
mongoose.set('strictQuery', true)
mongoose
    .connect('mongodb+srv://chamalkaMarasinghe:8tqhT1RE8APcKZv6@cluster0.tjh57ad.mongodb.net/recipe_app?retryWrites=true&w=majority')
    .then(() => {
        server.listen(3001, () => {console.log(`server running on port ${3001}`);})
    })
    .catch((err) => {console.log(err);})