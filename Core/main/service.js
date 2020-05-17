const express = require('express');
const app = express.Router();
const fn = require('../Library/algo');
const db = require('../Library/db_query');
const msg = require('../Library/sys_message');

//Down Here is POST
//record time in normal way
app.post('/time/', async function (req, res) {

    let ret = await req.body;
    // let token = await req.headers.token;
    let token = ret.token;

    // only key named time is allowed
    // ternary operator is used to shortend the codeline
    try {
        if (token == null) throw 500;
        if (fn.check_count(ret, msg.time)) {
            if (fn.isInt(ret.time)) {
                // let result_string = fn.n2b(ret.time);
                db.record_time(ret.time, token).then(function (ret) {
                    switch (true) {
                        case ret == 1:
                            res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
                            break;
                        case ret == 0:
                            res.send(fn.msg_return(msg.status[1], msg.message[5], []));
                            break;
                        case ret == 2:
                            res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                            break;
                        default:
                            res.send(fn.msg_return(msg.status[1], ret, []));

                    }

                })
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }
        }
        else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {
        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    }

})

//record prize
app.post('/prize', async function (req, res) {

    let ret = await req.body;
    //  let token = await req.headers.token;
    let token = ret.token;
    try {
        if (token == null) throw 500;
        if (fn.check_count(ret, msg.prize)) {
            if (fn.isInt(ret["prize"])) {
                // let result_string = fn.n2b(ret.prize);

                db.record_prize(ret.prize, token).then(function (ret) {
                    switch (true) {
                        case ret == 1:
                            res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
                            break;
                        case ret == 0:
                            res.send(fn.msg_return(msg.status[1], msg.message[5], []));
                            break;
                        case ret == 2:
                            res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                        default:
                            res.send(fn.msg_return(msg.status[1], ret, []));
                    }
                });
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }

        } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {
        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    }



})

//record lottery in normal way 
app.post('/lottery', async function (req, res) {

    let ret = await req.body;

    // let token = await req.headers.token;
    let token = ret.token;

    try {
        if (token == null) throw 500;
        if (fn.check_count(ret, msg.lottery)) {
            if (fn.isInt(ret["alphabet"], ret["number"], ret["prize"], ret["time"])) {
                db.record(ret, token).then(function (result) {
                    switch (result) {
                        case 1: res.send(fn.msg_return(msg.status[0], msg.message[0], []));
                            break;
                        case 0: res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                            break;
                        case 3: res.send(fn.msg_return(msg.status[1], msg.message[11], []));
                            break;
                        case 4: res.send(fn.msg_return(msg.status[1], msg.message[12], []));
                            break;
                        default: res.send(fn.msg_return(msg.status[1], msg.message[1], []));
                    }
                })
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }

        } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {
        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    }


})

//search number
app.post('/search', async function (req, res) {
    let data = await req.body;

    if (fn.check_count(data, msg.search)) {
        db.search(data).then(function (ret) {
            res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
        })
    } else {
        res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }
})

//query search by number
app.post('/searchByNumber', async function (req, res) {
    // /searchByNumber/:alphabet/:begin/:end/:time
    let data = await req.body;

    if (fn.check_count(data, msg.search_number)) {
        if (fn.isInt(data["alphabet"], data["begin"], data["end"], data["time"])) {
            db.searchByNumber(data).then(function (ret) {
                res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
            })
        }
        else {
            res.send(fn.msg_return(msg.status[1], msg.message[4], []));
        }

    } else {
        res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }

})

//query search by alphabet
app.post('/searchByAlphabet', async function (req, res) {
    // /searchByAlphabet/:number/:begin/:end/:time
    let data = await req.body;

    if (fn.check_count(data, msg.search_alphabet)) {
        if (fn.isInt(data["number"], data["begin"], data["end"], data["time"])) {
            db.searchByAlphabet(data).then(function (ret) {
                res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
            })
        } else {
            res.send(fn.msg_return(msg.status[1], msg.message[4], []));
        }

    } else {
        res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }

})


//delete lottery here
app.post('/removeById', async function (req, res) {
    let data = await req.body;

    // let token = await req.headers.token;
    let token = data.token;
    try {
        if (token == null) throw 500;
        if (fn.check_count(data, msg.lotteryId)) {
            if (fn.isInt(data["id"])) {
                db.removeById(data, token).then(function (ret) {
                    if (ret == 1) {
                        res.send(fn.msg_return(msg.status[0], msg.message[0], []));
                    } else if (ret == 2) {
                        res.send(fn.msg_return(msg.status[0], msg.message[7], []));
                    } else {
                        res.send(fn.msg_return(msg.status[1], msg.sqlMessage, []));
                    }
                })
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }

        } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {

        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    }

})

//update lottery here
app.post('/updateById', async function (req, res) {
    let data = await req.body;

    let token = data.token;

    try {
        if (token == null) throw 500;
        if (fn.check_count(data, msg.updateLottery)) {
            if (fn.isInt(data["id"], data["alphabet"], data["number"], data["time"], data["prize"])) {
                db.updateById(data, token).then(function (ret) {
                    switch (true) {
                        case ret == 2: res.send(fn.msg_return(msg.status[1], msg.message[7], ret));
                            break;
                        case ret == 3: res.send(fn.msg_return(msg.status[1], msg.message[11], []));
                            break;
                        case ret == 4: res.send(fn.msg_return(msg.status[1], msg.message[12], []));
                            break;
                        case ret == 0: res.send(fn.msg_return(msg.status[1], msg.message[10], []));
                            break;
                        default: res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
                            break;
                    }
                })
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }

        } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {

        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    }

})



// delete prize

app.post("/delPrize", async (req, res) => {
    let data = await req.body;
    let token = data.token;

    if (token == null) {
        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    } else if (fn.check_count(data, msg.delPrize)) {
        if (fn.isInt(data["id"])) {
            do1();
        } else {
            res.send(fn.msg_return(msg.status[1], msg.message[4], []));
        }

    } else {
        res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }


    function do1() {
        db.delPrize(data, token).then((ret) => {
            switch (true) {
                case ret == 1: res.send(fn.msg_return(msg.status[0], msg.message[0], []));
                    break;
                case ret == 2: res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                    break;
                default: res.send(fn.msg_return(msg.status[1], msg.message[1], ret));
            }
        })
    }

})

//update prize

app.post("/updatePrize", async (req, res) => {
    let data = await req.body;
    let token = data.token;

    try {
        if (token == null) {
            res.send(fn.msg_return(msg.status[1], msg.message[6], []));
        } else if (fn.check_count(data, msg.upPrize)) {
            if (fn.isInt(data["id"], data["value"])) {
                do2();
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }

        } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {
        console.log(err)
    }

    function do2() {
        db.updatePrize(data, token).then((ret) => {

            switch (true) {
                case ret.length == 0: res.send(fn.msg_return(msg.status[1], msg.message[9], []));
                    break;
                case ret == 0: res.send(fn.msg_return(msg.status[1], msg.message[1], ret));
                    break;
                case ret == 2: res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                    break;
                case ret == 3: res.send(fn.msg_return(msg.status[1], msg.message[13], []));
                    break;
                default: res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
            }
        })
    }

})

//update Time 
app.post("/updateTime", async (req, res) => {
    let data = await req.body;
    let token = data.token;

    try {
        if (token == null) {
            res.send(fn.msg_return(msg.status[1], msg.message[6], []));
        } else if (fn.check_count(data, msg.upTime)) {
            if (fn.isInt(data["id"], data["value"])) {
                do2();
            } else {
                res.send(fn.msg_return(msg.status[1], msg.message[4], []));
            }

        } else {
            res.send(fn.msg_return(msg.status[1], msg.error[0], []));
        }
    } catch (err) {
        console.log(err)
    }

    function do2() {
        db.updateTime(data, token).then((ret) => {

            switch (true) {
                case ret.length == 0: res.send(fn.msg_return(msg.status[1], msg.message[9], []));
                    break;
                case ret == 0: res.send(fn.msg_return(msg.status[1], msg.message[1], ret));
                    break;
                case ret == 2: res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                    break;
                case ret == 3: res.send(fn.msg_return(msg.status[1], msg.message[13], []));
                    break;
                default: res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
            }
        })
    }

})

//Delete time 
app.post("/delTime", async (req, res) => {
    let data = await req.body;
    let token = data.token;

    if (token == null) {
        res.send(fn.msg_return(msg.status[1], msg.message[6], []));
    } else if (fn.check_count(data, msg.delTime)) {
        if (fn.isInt(data["id"])) {
            do1();
        } else {
            res.send(fn.msg_return(msg.status[1], msg.message[4], []));
        }

    } else {
        res.send(fn.msg_return(msg.status[1], msg.error[0], []));
    }


    function do1() {
        db.delTime(data, token).then((ret) => {
            switch (true) {
                case ret == 1: res.send(fn.msg_return(msg.status[0], msg.message[0], []));
                    break;
                case ret == 2: res.send(fn.msg_return(msg.status[1], msg.message[7], []));
                    break;
                default: res.send(fn.msg_return(msg.status[1], msg.message[1], ret));
            }
        })
    }

})



//Down Here is GET
//get all prize
app.get('/getPrize', async function (req, res) {
    db.getPrize().then(function (ret) {
        res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
    })
})



//get all the recored time in normal way

app.get('/getTime', async function (req, res) {
    db.getTime().then(function (ret) {
        res.send(fn.msg_return(msg.status[0], msg.message[0], ret));
    })
})





//get lottery in normal way
app.get('/lottery_all', function (req, res) {
    db.fetch().then(function (result) {
        if (result == null) {
            res.send(fn.msg_return(msg.status[1], msg.message[1], []));
        } else {
            res.send(fn.msg_return(msg.status[0], msg.message[0], result));
        }
    })
})



//https://github.com/CodAffection/Node.js-MySQL-CRUD-Operations/blob/master/index.js







module.exports = app;
