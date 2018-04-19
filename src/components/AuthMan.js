import {ACCESS_TOKEN_KEY, ID_TOKEN_KEY, CLIENT_DOMAIN, CLIENT_ID} from "../AuthConstants";
import auth0 from "auth0-js";
import decode from "jwt-decode";

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
    const idToken = getAccessToken();
    return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}

export function isTokenExpired(token) {
    const expirationDate = getTokenExpirationDate(token);
    return expirationDate < new Date();
}

export function login() {
    let auth = new auth0.WebAuth({
        clientID: CLIENT_ID,
        domain: CLIENT_DOMAIN
    });

    auth.authorize({
        responseType: 'token id_token',
        redirectUri: `${window.location.origin}/callback`,
        audience: "https://msrapitest/",
        scope: "access:all"
    });
}

export function logout(){
    console.log("Signing Out");
    clearIdToken();
    clearAccessToken();
    window.location.href = '/';
}