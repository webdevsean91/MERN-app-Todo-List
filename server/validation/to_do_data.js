const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateToDoInput(data) {
    let errors = {};
    //Debug
    //console.log("******* data ******")
    //console.log(data)

    // Convert empty fields to an empty string so we can use validator functions
    data.user_id = !isEmpty(data.user_id) ? data.user_id : "";
    data.to_do = !isEmpty(data.to_do) ? data.to_do : "";
    // user_id checks
    if (Validator.isEmpty(data.user_id)) {
        errors.user_id = "User_id field is required";
    }
    // to_do checks
    if (Validator.isEmpty(data.to_do)) {
        errors.to_do = "To_do field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};