const conf = require('../Library/db_config');
const token = require('jsonwebtoken');
const msg = require('../Library/sys_message');
let conn = conf.db_connect();

//get all lottery data 
function fetch() {
    return new Promise(function (resolve, reject) {
        conn.query("select id, alphabet, number, prize_value, time_value from (select id, alphabet, number, time, prize_value from lottery as L left join prize as P on L.prize = P.prize_id) as result left join time as T on result.time = T.time_id;", function (err, result) {
            (err) ? resolve(err) : resolve(result);
        })
    });
}

//insert lottery data
function record(dat, tok) {
    return new Promise(function (resolve, reject) {
        checkToken(tok).then(async function (ret) {
            if (ret) {
                Promise.all([
                    ID(dat.time, 'time'),
                    ID(dat.prize, 'prize'),
                ]).then((ret) => {

                    switch (true) {
                        case ret[0].length == 0: resolve(3);
                            break;
                        case ret[1].length == 0: resolve(4);
                            break
                    }
                    if (ret[1].length > 0 && ret[0].length > 0) {
                        let [tID, pID] = [ret[0][0]["time_id"], ret[1][0]["prize_id"]];
                        conn.query("INSERT INTO lottery (alphabet, number, prize, time ) VALUES (" + dat.alphabet + "," + dat.number + "," + pID + "," + tID + ");", function (err, result) {
                            (err) ? resolve(err) : resolve(1);
                        })
                    }
                })

            } else {
                resolve(0);
            }
        });
    });
}

//search query using only number
function search(data) {
    return new Promise(function (resolve, reject) {
        conn.query("select id, alphabet, number, prize_value, time_value from (select id, alphabet, number, time, prize_value from lottery as L left join prize as P on L.prize = P.prize_id) as result left join time as T on result.time = T.time_id where alphabet=" + "\'" + data.alphabet + "\'" + "and number=" + "\'" + data.number + "\';", function (err, result) {
            (err) ? resolve(err) : resolve(result);
        })
    });
}

//insert time , dupication is prevented.
function record_time(data, tok) {
    let noDuplication = true;
    return new Promise(function (resolve, reject) {
        checkToken(tok).then(async function (ret) {
            if (ret) {
                conn.query("select time_value from time", function (err, resultFromDB) {

                    for (value in resultFromDB) {
                        if (data == resultFromDB[value]['time_value']) {
                            noDuplication = false;
                            resolve(0);
                            break
                        }
                    }
                    if (noDuplication) {
                        conn.query("insert into time(time_value) values (" + "'" + data + "'" + ");", function (err, result) {
                            (err) ? resolve(err) : resolve(1);
                        })
                    }

                })
            } else {
                resolve(2);
            }
        })
    })
}

//insert prize
function record_prize(prize, tok) {
    let noDuplication = true;

    return new Promise(function (resolve, reject) {
        checkToken(tok).then(async function (ret) {

            if (ret) {
                conn.query("select prize_value from prize", function (err, res) {

                    for (data in res) {
                        if (prize == res[data]['prize_value']) {
                            noDuplication = false;
                            resolve(0);
                            break;
                        }

                    }
                    if (noDuplication) {
                        conn.query("INSERT INTO prize(prize_value) VALUES (" + "\"" + prize + "\"" + ");", function (err, res) {
                            (err) ? resolve(err) : resolve(1);
                        })
                    }
                });
            } else {
                resolve(2);
            }


        })
    })
}

//get all prie
function getPrize() {
    return new Promise(function (resolve, reject) {
        conn.query("select prize_id, prize_value from prize order by prize_id;", function (err, res) {
            (err) ? resolve(err) : resolve(res);
        })
    })
}

//get all times
function getTime() {
    return new Promise(function (resolve, reject) {
        conn.query("select time_id, time_value from time order by time_id;", function (err, res) {
            (err) ? resolve(err) : resolve(res);
        })
    })
}

//register all user
function register(user, pass) {

    return new Promise(function (resolve, reject) {

        let goToRegisterUser = false;

        conn.query("SELECT Username FROM User WHERE Username = " + "\"" + user + "\"" + ";", async function (err, res) {
            let dat = await res;

            if (dat.length == 0) {
                goToRegisterUser = true;
            }

            if (goToRegisterUser) {
                conn.query("INSERT INTO User(Username,Password) VALUES (" + "\"" + user + "\"" + "," + "\"" + pass + "\"" + ");", function (err, result) {
                    (err) ? resolve(err) : resolve(1);
                });
            } else {
                resolve(0);
            }
        });

    })

}



//get userInfo
function get_UserInfo(username, password) {
    return new Promise(function (resolve, reject) {
        conn.query("SELECT id, Username, Password FROM User where Username=" + "\"" + username + "\"" + "and Password=" + "\"" + password + "\"" + ";", function (err, result) {
            if (result.length > 0) {
                let gT = token.sign(username, msg.private_key);
                conn.query("UPDATE User SET session_id = " + "\"" + gT + "\"" + " WHERE Password = " + "\"" + result[0]['Password'] + "\"" + ";", function (err, res) {
                    result[0]["session_id"] = gT;
                    (err) ? resolve(err) : resolve(result);
                })
            } else {
                (err) ? resolve(err) : resolve(result);
            }
        });
    });
}

//search query using only number
function search(data) {
    return new Promise(function (resolve, reject) {
        conn.query("select id, alphabet, number, prize_value, time_value from (select id, alphabet, number, time, prize_value from lottery as L left join prize as P on L.prize = P.prize_id) as result left join time as T on result.time = T.time_id where alphabet=" + "\'" + data.alphabet + "\'" + "and number=" + "\'" + data.number + "\'" + " and time =" + '"' + data.time + '";', function (err, result) {
            (err) ? resolve(err) : resolve(result);
        })
    });
}



//search by number and fix alphabet
function searchByNumber(data) {
    return new Promise(function (resolve, reject) {
        let a = parseInt(data.begin);
        let b = parseInt(data.end);
        if (a > b) {
            let tmp;
            tmp = data.begin
            data.begin = data.end
            data.end = tmp
        }
        conn.query("select id, alphabet, number, prize_value, time_value from (select id, alphabet, number, time, prize_value from lottery as L left join prize as P on L.prize = P.prize_id) as result left join time as T on result.time = T.time_id where alphabet=" + "\'" + data.alphabet + "\'" + "and time=" + '"' + data.time + '"' + " and number between" + "\'" + data.begin + "\'" + "and" + "\'" + data.end + "\'+1;", function (err, result) {
            (err) ? resolve(err) : resolve(result);
        })
    });
}

//search by alphabet and fix number
function searchByAlphabet(data) {
    return new Promise(function (resolve, reject) {
        let a = parseInt(data.begin);
        let b = parseInt(data.end);
        if (a > b) {
            let tmp;
            tmp = data.begin
            data.begin = data.end
            data.end = tmp
        }
        conn.query("select id, alphabet, number, prize_value, time_value from (select id, alphabet, number, time, prize_value from lottery as L left join prize as P on L.prize = P.prize_id) as result left join time as T on result.time = T.time_id where number=" + "\'" + data.number + "\'" + "and time=" + '"' + data.time + '"' + "and alphabet between " + "\'" + data.begin + "\'" + "and" + "\'" + data.end + "\'+1;", function (err, result) {
            (err) ? resolve(err) : resolve(result);
        })
    });
}

//remove by id
function removeById(data, tok) {
    return new Promise(function (resolve, reject) {
        checkToken(tok).then(async function (ret) {
            if (ret) {
                conn.query("delete from lottery where id=" + data.id + ";", function (err, result) {
                    (err) ? resolve(err) : resolve(1)
                })
            } else {
                resolve(2);
            }
        })
    })
}



//update by id
function updateById(data, tok) {


    let result = new Promise(function (resolve, reject) {
        checkToken(tok).then(async (ret) => {

            if (ret) {

                Promise.all([
                    ID(data.time, 'time'),
                    ID(data.prize, 'prize'),
                ]).then((ret) => {
                    console.log("this is ret", ret);
                    switch (true) {
                        case ret[0].length == 0: resolve(3);
                            break;
                        case ret[1].length == 0: resolve(4);
                            break
                    }

                    if (ret[1].length > 0 && ret[0].length > 0) {
                        let [tID, pID] = [ret[0][0]["time_id"], ret[1][0]["prize_id"]];
                        conn.query(`UPDATE lottery SET  alphabet=${data.alphabet}, number=${data.number}, time=${tID}, prize=${pID} WHERE id=${data.id};`, function (err, result) {
                            if (err) {
                                resolve(0)
                            } else {
                                conn.query(`select id, alphabet, number, prize_value, time_value from (select id, alphabet, number, time, prize_value from lottery  as L left join prize as P on L.prize = P.prize_id)  as result  left join time as T on result.time = T.time_id  where id=${data.id};`, (err, result) => {
                                    resolve(result);
                                })
                            }
                        })
                    }
                })



            } else {
                resolve(2);
            }

        })
    })

    return result;
}



//delete time 
function delTime(data, token) {
    let suc = new Promise((resolve, reject) => {
        checkToken(token).then(async (ret) => {
            if (ret) {
                delID(data["id"], "time").then((ret) => {
                    resolve(ret);
                })
            } else {
                resolve(2)
            }
        })
    })
    return suc;
}
//delete prize 
function delPrize(data, token) {
    let suc = new Promise((resolve, reject) => {
        checkToken(token).then(async (ret) => {
            if (ret) {
                delID(data["id"], "prize").then((ret) => {
                    resolve(ret);
                })
            } else {
                resolve(2)
            }
        })
    })
    return suc;
}

//update time
function updateTime(data, token) {
    let suc = new Promise((resolve, reject) => {
        checkToken(token).then(async (ret) => {
            if (ret) {
                upID(data["id"], data["value"], "time").then((ret) => {
                    if (ret == 0) {
                        resolve(ret);
                    } else if (ret == 3) {
                        resolve(ret);
                    } else {
                        conn.query(`SELECT time_id, time_value FROM time WHERE time_id = ${data.id}`, (err, result) => {
                            resolve(result);
                        })
                    }
                })

            } else {
                resolve(2)
            }
        })
    })
    return suc;
}

//update Prize
function updatePrize(data, token) {
    let suc = new Promise((resolve, reject) => {
        checkToken(token).then(async (ret) => {
            if (ret) {
                upID(data["id"], data["value"], "prize").then((ret) => {
                    if (ret == 0) {
                        resolve(ret);
                    } else if (ret == 3) {
                        resolve(ret);
                    } else {
                        conn.query(`SELECT prize_id,prize_value FROM prize WHERE prize_id = ${data.id}`, (err, result) => {
                            resolve(result);
                        })
                    }
                })

            } else {
                resolve(2)
            }
        })
    })
    return suc;
}

//logout
function logOut(tok) {
    return new Promise(function (resolve, reject) {
        let t = token.verify(tok, msg.private_key);
        conn.query("UPDATE User SET session_id = " + 0 + " WHERE Username =" + "'" + t + "';", function (err, res) {
            (err) ? resolve(0) : resolve(1);
        })
    })
}

//check token
function checkToken(tok) {
    return new Promise((resolve, reject) => {
        try {
            let t = token.verify(tok, msg.private_key);
            conn.query(`SELECT id FROM User WHERE session_id = '${tok}' AND Username ='${t}';`, function (err, res) {
                if (res.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }

            });
        } catch (err) {
            resolve(false);
        }

    })
}


//Common Function Down here
let ID = (V, char) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT ${char}_id, ${char}_value FROM ${char} WHERE ${char}_value = ${V};`, (err, result) => {
            resolve(result);
        });
    })

}

let delID = (delId, tbName) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM ${tbName} WHERE ${tbName}_id = ${delId};`, (err, res) => {

            (err) ? resolve(0) : resolve(1);
        })
    })
}

let upID = (upId, upV, tbName) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT ${tbName}_value FROM ${tbName} WHERE ${tbName}_id = ${upId};`, (err, res) => {
            if (res) {
                resolve(3);
            } else {
                conn.query(`UPDATE ${tbName} SET ${tbName}_value = ${upV} WHERE ${tbName}_id = ${upId};`, (err, res) => {
                    console.log("this is error ", err);
                    (err) ? resolve(0) : resolve(1);
                })
            }
        })

    })
}



module.exports = {
    fetch: fetch,
    record: record,
    search: search,
    record_time: record_time,
    get_UserInfo: get_UserInfo,
    register: register,
    getTime: getTime,
    record_prize: record_prize,
    getPrize: getPrize,
    searchByAlphabet: searchByAlphabet,
    searchByNumber: searchByNumber,
    removeById: removeById,
    updateById: updateById,
    logOut: logOut,
    delPrize: delPrize,
    updatePrize: updatePrize,
    delTime: delTime,
    updateTime: updateTime,
};