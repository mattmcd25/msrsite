import ReactDOM from 'react-dom';
import React from "react";
import './css/index.css';
import AppRoutes from "./components/pages/AppRoutes";
import { connect } from "./data/databaseManager";

connect().then(value => {
    ReactDOM.render(
        <AppRoutes/>,
        document.getElementById('root')
    )
});
