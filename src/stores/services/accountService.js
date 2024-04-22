import axios from '@/axios';
// import store from '@/store';

export const accountService = {
    createUser,
    login,
    logout,
    sendVerificationEmail,
    verifyEmail,
    sendResetPasswordEmail,
    resetPassword,
    sendSupportMessage,
    changeLicense,
    getCurrentUser
}

export {
    checkUserAuthentication, sendSupportMessage
};

// Checks if the current User is authenticated
function checkUserAuthentication() {
    return axios.post('/accounts/user/validate-authentication', {}, {withCredentials: true})
        .then(response => {
            return response;
        })
}


function createUser(firstName, lastName, email, phone, password1, password2, role, department, func, accessCode) {
    return axios.post('/accounts/user',
        JSON.stringify({first_name: firstName,
                        last_name: lastName,
                        email: email,
                        phone_number: phone,
                        password1: password1,
                        password2: password2,
                        role: role,
                        department: department,
                        function: func,
                        access_code: accessCode}),
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        });
}


function login(email, password) {
    return axios.post('/auth/token',
        JSON.stringify({email: email, password: password}),
        {withCredentials: true, headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        });
}


function logout() {
    return axios.post('/auth/logout',
        {},
        {withCredentials: true, skipAuthRefresh: true})
        .then(response => {
            return response;
        });
}


function sendVerificationEmail(email) {
    return axios.post('/accounts/user/send/verify-email',
        JSON.stringify({email: email}),
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        });
}


function verifyEmail(uid, token) {
    return axios.patch('/accounts/user/verify-email',
        JSON.stringify({uid: uid, token: token}),
        {withCredentials: true, headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        });
}


function sendResetPasswordEmail(email) {
    return axios.post('/accounts/user/send/reset-password',
        JSON.stringify({email: email}),
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
           return response;
        });
}


function resetPassword(uid, token, password1, password2) {
    return axios.patch('/accounts/user/reset-password',
        JSON.stringify({uid: uid, token: token, password1: password1, password2: password2}),
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        });
}


function changeLicense(accessCode) {
    return axios.patch('/accounts/user/upgrade',
        JSON.stringify({access_code: accessCode}),
        {withCredentials: true, headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        })
}


function sendSupportMessage(email, subject, body) {
    return axios.post('/accounts/support',
        JSON.stringify({email: email, subject: subject, body: body}),
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response;
        })
}


function getCurrentUser() {
    return axios.get('/accounts/user', {withCredentials: true})
        .then(response => {
            return response;
        })
}
