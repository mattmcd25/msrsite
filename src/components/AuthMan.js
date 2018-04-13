import {ACCESS_TOKEN_KEY, ID_TOKEN_KEY, CLIENT_DOMAIN, CLIENT_ID} from "../AuthConstants";
import React from "react";
import auth0 from "auth0-js";
import decode from "jwt-decode";
export let userLevel;
export let sysToken;

export function getSysToken(){
    let request = require("request-promise");

    let options = { method: 'POST',
        url: 'https://rwwittenberg.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body:
            { grant_type: 'client_credentials',
                client_id: 'fROUBRhDoOuMPdLBX2rtHxrZFPFVo171',
                client_secret: '-yWrqF9i6V4t9rlV-_l8bkl4fExqvml6L1b_y5_gLvD2aIdgIe1_q-FkWDzovL5O',
                //audience: 'https://msrapitest/'},
                audience: 'https://rwwittenberg.auth0.com/api/v2/'},
        json: true };


    return request(options)
        .then(response => {
            sysToken = response['access_token'];
            console.log(sysToken);
        });
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

export function getLevel() {
    let request = require("request-promise");
    let user_id = decode(getIdToken())['sub'];
    console.log(user_id);
    let options = {
        method: 'GET',
        url: 'https://rwwittenberg.auth0.com/api/v2/users/' + user_id,
        qs: {fields: 'app_metadata', include_fields: 'true'},
        headers:
            {
                'content-type': 'application/json',
                authorization: `Bearer ${sysToken}`
            }
    };
    console.log("requesting ...");
    return (request(options)
        .then(response => {
            try {
                userLevel = JSON.parse(response)['app_metadata']['level'];

            }catch(e){
                userLevel = "newUser";
            }
            console.log(userLevel);
        }));
}

export function login() {
    let auth = new auth0.WebAuth({
        clientID: CLIENT_ID,
        domain: CLIENT_DOMAIN
    });

    auth.authorize({
        responseType: 'token id_token',
        redirectUri: "http://localhost:3000/callback",
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