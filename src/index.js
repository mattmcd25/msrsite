import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';
import { getAllColumns, getAll } from "./data/databaseManager";
import LaunchScreen from "./components/LaunchScreen";

export var HEADERS = [];
export var CONSTANTS = [];

ReactDOM.render(
    <LaunchScreen/>,
    document.getElementById('root'),
    () => initialize().then(x => {
        ReactDOM.render(
            <App/>,
            document.getElementById('root')
        );
    })
);

async function initialize() {
    WebFontLoader.load({
        google: {
            families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
        },
    });

    HEADERS['Member'] = await getAllColumns('Member');
    CONSTANTS['Skill'] = await getAll('Skill');
}