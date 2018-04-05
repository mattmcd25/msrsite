import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';
import {getAllColumns} from "./data/databaseManager";
//import { isLoggedIn } from "./AuthService";
//import UnauthorizedPage from "./components/pages/UnauthorizedPage";

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
    },
});


export var mem_cols = [];

export function setMemCols(){
    getAllColumns('Member')
        .then(cols => {
            mem_cols = cols;
            console.log(mem_cols);
        });
    return mem_cols;
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);