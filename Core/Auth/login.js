const express = require('express');
const app = express.Router();
const crypto = require('crypto');
const fn = require('../Library/algo');
const db = require('../Library/db_query');
const msg = require('../Library/sys_message');

//login admin
app.post('/login/', async function (req, res) {

    let ret = await req.body;
    var un = ret.username;
    var pw = ret.password;
    if (fn.check_count(ret, msg.user)) {

        let hash = crypto.createHash('sha256');

        let pass = hash.update(pw).digest("hex");

        db.get_UserInfo(un, pass).then(function (user_info) {
            if (user_info.length != 0) {
                res.set("Token", user_info[0]["session_id"]);
                res.send(fn.msg_return(msg.status[0], msg.message[0], fn.user_return(user_info[0]["Username"], user_info[0]["session_id"])));
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[2], []));
            }
        })
    } else {
        res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }


}
);

//Register User
app.post('/Register/', async function (req, res) {

    let ret = await req.body;

    if (fn.check_count(ret, msg.user)) {

        let hash = crypto.createHash('sha256');

        let pass = hash.update(ret.password).digest("hex");

        db.register(ret.username, pass).then(function (ret) {
            switch(true){
                case ret == 1:   res.send(fn.msg_return(msg.status[0],msg.message[0],ret));
                break;
                case ret == 0 :   res.send(fn.msg_return(msg.status[0],msg.message[3],[]));
                break;
                default :   res.send(fn.msg_return(msg.status[0],ret,[]));
                break;
            }          

        })
    } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }

});

app.post('/logout/', async function(req, res){
   let token = await req.body.token;
  if (token == null){
       res.send(fn.msg_return(msg.status[1],msg.message[8], []));
   }
   db.logOut(token).then(function (ret){
       if(ret == 1){
        res.send(fn.msg_return(msg.status[0],msg.message[0],ret));
       }else{
        res.send(fn.msg_return(msg.status[1],msg.message[1],ret));
       }
   })
})


module.exports = app;
