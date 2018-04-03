import { Component } from 'react';
import { setIdToken, setAccessToken } from '../AuthService';
import { setMemCols } from "../index";

class Callback extends Component {

    componentDidMount() {
        setAccessToken();
        setIdToken();
        setMemCols();
        window.location.href = "/";


    }

    render() {
        return null;
    }
}

export default Callback;