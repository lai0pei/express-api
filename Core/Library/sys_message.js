let error = ["Type of key or value is not permitted"];
let status = ["200", "400"];
let condition = ["0", "1"];
let message = [
    "Success",
    "Fail",
    "No Such User",
    "This user is already registered",
    "Only Numbers are allowed",
    "The same data is recorded",
    "User is not Login",
    "Invalid Token",
    "No token is sent",
    "This Id does not exist",
    "sqlError",
    "invalid time value",
    "invalid prize value",
    "this value is already existed",
];
const private_key = "0123456789abcde";



//defined an range of input
const time = ["time", "token"];
const lottery = ["alphabet", "number", "time", "prize", "token"];
const user = ["username", "password"];
const prize = ["prize", "token"];
const search_number = ["alphabet", "begin", "end", "time"];
const search_alphabet = ["number", "begin", "end", "time"];
const search = ["number", "alphabet", "time"];
const lotteryId = ["id", "token"];
const updateLottery = ["alphabet", "number", "time", "prize", "id", "token"];
const delPrize = ["id", "token"];
const upPrize = ["id", "value", "token"];
const delTime = ["id", "token"];
const upTime = ["id", "value", "token"];



module.exports = {
    error: error,
    status: status,
    time: time,
    lottery: lottery,
    user: user,
    condition: condition,
    private_key: private_key,
    message: message,
    prize: prize,
    search_number: search_number,
    search_alphabet: search_alphabet,
    search: search,
    lotteryId: lotteryId,
    updateLottery: updateLottery,
    delPrize: delPrize,
    upPrize: upPrize,
    delTime: delTime,
    upTime: upTime,
}