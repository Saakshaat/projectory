const isEmpty = (string) => {
    if(string === undefined || string.trim() === ``) return true;
    else return false;
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(regEx);
}

const isStrongPassword = (password) => {
    const passwordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})")
    if(password.length < 8 || !password.match(passwordRegex)) return false;
    return true;
}

exports.validateSignup = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    else if(!isEmail(data.email)) errors.email = 'Must be valid';

    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(!isStrongPassword(data.password)) errors.password = 'Password must be 8 characters long and must contain atleast one number and special character'
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLogin = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    else if(!isEmail(data.email)) errors.email = 'Must be valid';

    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateExists = (data) => {
    return isEmpty(data) ? false : true;
}