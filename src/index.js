require('dotenv').config();

// import Koa from 'koa';
// import Router from 'koa-router';
// import mongoose from 'mongoose';
// import bodyParser from 'koa-bodyparser';
// import { jwtMiddleware } from './lib/token';

const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser')
const { jwtMiddleware } = require('./lib/token');

const app = new Koa();
const router = new Router();
const api = require('./api');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then (
    (response) => {
        console.log('Successfully connected to mongoDB');
    }
).catch(e =>{
    console.error(e);
});


const port = process.env.PORT || 4000;

app.use(bodyParser());
app.use(jwtMiddleware);
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, ()=>{
    console.log('moon\'s server is listening to port' + port);
});