import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
    },
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);