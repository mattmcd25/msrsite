import decode from 'jwt-decode';
import auth0 from 'auth0-js';
const ID_TOKEN_KEY = 'id_key';
const ACCESS_TOKEN_KEY = 'access_key';
const CLIENT_ID = 'OyYZ0FSDpdF79RETF4A53Qj7qywc457R';
const CLIENT_DOMAIN = 'rwwittenberg.auth0.com';
const REDIRECT = 'http://localhost:3000/callback';
const SCOPE = 'access:all';
const AUDIENCE = 'https://msrapitest/';
let sysToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9EZzJOVU5HUVRaQk5VSTBORVZETnpjNU9USkNPRVUwTVVNeE1qazBSVEUwTURVeVJqVkJSQSJ9.eyJpc3MiOiJodHRwczovL3J3d2l0dGVuYmVyZy5hdXRoMC5jb20vIiwic3ViIjoiZlJPVUJSaERvT3VNUGRMQlgycnRIeHJaRlBGVm8xNzFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcnd3aXR0ZW5iZXJnLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTIyODQ2MDE0LCJleHAiOjE1MjI5MzI0MTQsImF6cCI6ImZST1VCUmhEb091TVBkTEJYMnJ0SHhyWkZQRlZvMTcxIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.mJkvi2aifEdxn25vEBTJEhpsUJj7AhbQ7IcaX9icoIsYjMo7GgHNXHYgDtAZrcpwyR6AWVFovwxbbP1FvT0RXuF6SLmdW1dwokhzAPnbb49IPTYJejUlP0AaDtDdq6Qxw92pukVmW1680VtVAN7Dg98J38uZ7ww_3x8rTn5X6VVeRLi46w6b4S7gJta7MkKrkWLkA_vzCD-oxGoAkK5y4BrgLDZApDMVc9Szw87wdsrXy2FDi7EE_yBOOKTKm3OlRZLrhyOZbNQXHlNI7SjRzP2i-uHtGA3z87d0zLsaiygBzcX0B0VnHRoqsLTG1z2A3p0QB69DcwjcT1b7MEzyAQ'


let auth = new auth0.WebAuth({
    clientID: CLIENT_ID,
    domain: CLIENT_DOMAIN
});


export function login() {
    console.log("logging in");
    auth.authorize({
        responseType: 'token id_token',
        redirectUri: REDIRECT,
        audience: AUDIENCE,
        scope: SCOPE
    });
}
export function getProfile(user_id) {
    let request = require("request");

    user_id = 'auth0|5abcac6849c317236e3b5ba4';
    let options = { method: 'GET',
        url: 'https://rwwittenberg.auth0.com/api/v2/users/'+user_id,
        qs: { fields: 'app_metadata', include_fields: 'true' },
        headers:
            { 'content-type': 'application/json',
                Authorization: `Bearer ${sysToken}` } };

    //console.log(localStorage.getItem("user-id"));

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        getProfile4(easycb);

    });
}

export function getProfile2(){
    var request = require("request");

    var options = { method: 'POST',
        url: 'https://rwwittenberg.auth0.com/oauth/token',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${sysToken}`
        },
        body: '{"client_id":"fROUBRhDoOuMPdLBX2rtHxrZFPFVo171","client_secret":"-yWrqF9i6V4t9rlV-_l8bkl4fExqvml6L1b_y5_gLvD2aIdgIe1_q-FkWDzovL5O","audience":"https://rwwittenberg.auth0.com/api/v2/","grant_type":"client_credentials"}' };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

export function getProfile3(){
    var request = require("request");

    var options = { method: 'GET',
        url: 'http://https://rwwittenberg.auth0.com/api/v2/user',
        headers: {'content-type': 'application/json', authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9EZzJOVU5HUVRaQk5VSTBORVZETnpjNU9USkNPRVUwTVVNeE1qazBSVEUwTURVeVJqVkJSQSJ9.eyJpc3MiOiJodHRwczovL3J3d2l0dGVuYmVyZy5hdXRoMC5jb20vIiwic3ViIjoiZlJPVUJSaERvT3VNUGRMQlgycnRIeHJaRlBGVm8xNzFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcnd3aXR0ZW5iZXJnLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTIyOTE4NjA2LCJleHAiOjE1MjMwMDUwMDYsImF6cCI6ImZST1VCUmhEb091TVBkTEJYMnJ0SHhyWkZQRlZvMTcxIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.eHU4M6-_0fOJ-llZXAdgTw6pnTDaplmXgsM6OQUE1Sgpsc7LKH6JxwKyPQHf7Ubn8qtJDRyvQjnBap1UIX80z4xWhXMSgt9BU3NrVRTh-3J_lPmtYQGDH4-95yh8BwkLwe16xzg3u-xsABNmT3723rHapJpdkF4DlqvgfgGCbZfTdIUBZxGEyWJk5QGA4h14mYtZpjnXgFSflTO6ujuAwuZrFW0dpHu_fDdvpUoB_0Asipuu8eb0lMdJyXeOdFAWDhkTFuciwwnDD3kM-h9QDDTaRqEGzivs67P45r4qS3KXnTj4n5_pB3KZIp4i7MwvtggvT7ArigT20-lIW30Q7g' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

function easycb(e, p){
    console.log(p);
    console.log("err: " + e);
}

function getProfile4(cb) {
    let accessToken = getAccessToken();
    auth.client.userInfo(accessToken, (err, profile) => {
        console.log(JSON.stringify(profile));
        cb(err, profile);
    });
}

export function logout() {
    console.log("Signing Out");
    clearIdToken();
    clearAccessToken();
}

export function requireAuth() {
    if (!isLoggedIn()) {
        //this.context.history.push('/login')
    }
}

export function getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
    localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
    let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
    let accessToken = getParameterByName('access_token');
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
    let idToken = getParameterByName('id_token');
    localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
    const idToken = getIdToken();
    return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}

function isTokenExpired(token) {
    const expirationDate = getTokenExpirationDate(token);
    return expirationDate < new Date();
}