import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';
import { getAllColumns, getAll } from "./data/databaseManager";
import LaunchScreen from "./components/LaunchScreen";

export var HEADERS = [];
export var CONSTANTS = [];
var searchResult = [];

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
    HEADERS['Work'] = await getAllColumns('Work');
    HEADERS['Language'] = await getAllColumns('Language');
    CONSTANTS['Skill'] = (await getAll('Skill')).map(s => s.NAME);
    CONSTANTS['Language'] = (await getAll('Language')).map(s => s.LANGUAGE);
}

export function storeSearch(result) {
    searchResult = result;
}

export function reclaimSearch() {
    return searchResult;
}