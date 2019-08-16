const   express = require("express")
        ,mongoose = require("mongoose")
        ,bodyParser = require("body-parser")
        ,to_do_users = require("./server/routes/api/to_do_users")
        ,to_do = require("./server/routes/api/to_do_data")
        ,passport = require("passport")
        ,app = express()
        ,keys = require('./server/config/keys')
        //,router = express.Router()
        //,cookieParser = require('cookie-parser')
        //,cookieSession = require('cookie-session')
        //,debug = require('debug')('http')
        //,http = require('http')
        //,name = 'My App'

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, Content-Length');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Bodyparser middleware
// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// parse application/json
app.use(bodyParser.json());

//router.use(require('./server/routes/middleware/tokenChecker'))

// DB Config
const db = require("./server/config/keys").mongoDB.dbURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => {
            // this time could 
            let d = new Date()
                ,dateTime = d.getFullYear() + ("0"+(d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2) + ":" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + ":" + d.getMilliseconds();
            
            console.log(`MongoDB successfully connected.`)
            console.log(`The date and time is ${dateTime}`)

        })
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./server/config/passport")(passport);

// Routes
app.use("/api/to_do/auth", to_do_users);    // order is important!!!
app.use("/api/to_do", to_do);

/*
with to_do_users loading last
http://localhost:9000/api/to_do/auth called a function in to_do rather than to_do_users
*/

// Debugging
app.get("/", (req, res) => {
    res.send("got home page with get")
})

const port = process.env.PORT || 9000 // process.env.port is Heroku's port if you choose to deploy the app there
    ,d = new Date()
    ,dateTime = d.getFullYear() + ("0"+(d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2) + ":" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + ":" + d.getMilliseconds();

app.listen(port, () => {
    console.log(`Express running on port ${port}.`)
    console.log(`The date and time is ${dateTime}`)
});