import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';
import { getAllColumns, getAll } from "./data/databaseManager";
import LaunchScreen from "./components/LaunchScreen";

export var HEADERS = [];
export var CONSTANTS = [];
let searchResult = [];

// ReactDOM.render(
//     <LaunchScreen/>,
//     document.getElementById('root'),
//     () => initialize().then(() => {
        ReactDOM.render(
            <App/>,
            document.getElementById('root')
        );
//     })
// );

export async function initialize() {
    WebFontLoader.load({
        google: {
            families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
        },
    });

    HEADERS['Member'] = await getAllColumns('Member');
    HEADERS['Work'] = await getAllColumns('Work');
    HEADERS['Skill'] = await getAllColumns('Skill');
    HEADERS['Language'] = await getAllColumns('Language');
    HEADERS['Site'] = await getAllColumns('Site');
    HEADERS['Certificate'] = await getAllColumns('Certificate');
    HEADERS['Has_Cert'] = await getAllColumns('Has_Cert');
    CONSTANTS['Skill'] = await getAll('Skill');
    CONSTANTS['Language'] = await getAll('Language');
    CONSTANTS['Site'] = await getAll('Site');
    CONSTANTS['Certificate'] = await getAll('Certificate');
}

export function storeSearch(result) {
    searchResult = result;
}

export function reclaimSearch() {
    return searchResult;
}