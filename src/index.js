import ReactDOM from 'react-dom';
import React from "react";
import './css/index.css';
import AppRoutes from "./App";
import {getAllColumns} from "./data/databaseManager";

export var mem_cols = [];
getAllColumns('Member')
    .then(cols => {
        mem_cols=cols;
        console.log(mem_cols);
    })
    .then(x => {
        ReactDOM.render(
            <AppRoutes/>,
            document.getElementById('root')
        );
    });