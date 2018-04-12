import { Component } from 'react';
import {setIdToken, setAccessToken, getIdToken} from './AuthMan';

class Callback extends Component {

    componentDidMount() {
        setAccessToken();
        setIdToken();
        console.log(getIdToken());

        window.location.href = "/";
    }

    render() {
        return null;
    }
}

export default Callback;