import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import App from "./App";
import WebFontLoader from 'webfontloader';
import { NavigationDrawer } from 'react-md';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});

// class Test extends React.Component {
//     render() {
//         return (
//             <NavigationDrawer
//                 drawerTitle="react-md with CRA"
//                 toolbarTitle="Welcome to react-md"
//             >
//                 <div className="App">
//                     <header className="App-header">
//                         <h1 className="App-title">Welcome to React</h1>
//                     </header>
//                     <p className="App-intro">
//                         To get started, edit <code>src/App.js</code> and save to reload.
//                     </p>
//                 </div>
//             </NavigationDrawer>
//         );
//     }
// };

ReactDOM.render(
    <App />,
    document.getElementById('root')
);