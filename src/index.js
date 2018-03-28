import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';
import {getAllColumns} from "./data/databaseManager";

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
    },
});

export var mem_cols = [];
getAllColumns('Member')
    .then(cols => {
        mem_cols=cols;
        console.log(mem_cols);
    })
    .then(x => {
        ReactDOM.render(
            <App />,
            document.getElementById('root')
        );
    });