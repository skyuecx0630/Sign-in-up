require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser')

const app = new Koa();
const router = new Router();
const api = require('./api');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
    
}).then (
    (response) => {
        console.log('Successfully connected to mongoDB');
    }
).catch(e =>{
    console.error(e);
});
// const db = mongoose.connection;
// db.once("open", a => {
//     console.log("DB connected");
// });
// db.on("error", err => {
//     console.log("DB ERROR : ", err);
// });

const port = process.env.PORT || 4000;

app.use(bodyParser());

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, ()=>{
    console.log('moon\'s server is listening to port' + port);
});