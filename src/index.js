import ReactDOM from 'react-dom';
import React from "react";
import './css/index.css';
import AppRoutes from "./App";
import { initialize } from './client';

initialize();

ReactDOM.render(
    <AppRoutes/>,
    document.getElementById('root')
);