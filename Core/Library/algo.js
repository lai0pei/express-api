// user_info
function user_return(name, sid) {
    const userObj = {
        "Admin": "",
        "Sid": "",
    };
    userObj.Admin = name;
    userObj.Sid = sid;
    return userObj;
}

// global response message
function msg_return(status, message, data) {
    const responseObj = {
        "status": "",
        "message": "",
        "data": {},
    };
    responseObj.status = status;
    responseObj.message = message;
    responseObj.data = data;
    return responseObj;
}

// Json Key Matcher
function check_count(dat, input_variable) {
    let index, next_index;
    let i = 0, y = 0;
    let obCount = Object.values(dat);

    if (obCount.length == input_variable.length) {
        for (index in dat) {
            for (next_index in input_variable) {
                if (index == input_variable[next_index]) {
                    i++
                    break
                }
            }
            y++
        }
        return (y != i) ? false : true;
    } else {
        return false;
    }

}

//Json value validation
function isInt(...dat) {
    var isTrue = true;
    let test;
    if (dat.length == 1) {
        test = parseInt(dat);

        if (test != dat) {
            isTrue = false;
        }
    } else {
        for (let s = 0; s < dat.length; s++) {
            test = parseInt(dat[s]);

            if (test != dat[s]) {
                isTrue = false;
                break;
            }

        }
    }

    return isTrue;

}

//Json value convertion
function n2b(dat) {
    let result_string = "";
    let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let number = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];

    let result = Array.from(String(dat), String);

    for (index in result) {
        for (value in num) {
            if (result[index] == num[value]) {
                str = num[value].toString();
                index_location = num.indexOf(str);
                result_string = result_string.concat(number[index_location]);

            }
        }
    }
    return result_string;

}


module.exports = {
    user_return: user_return,
    msg_return: msg_return,
    check_count: check_count,
    isInt: isInt,
    n2b: n2b,
};