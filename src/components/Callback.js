import { Component } from 'react';
import {setIdToken, setAccessToken} from './AuthMan';

class Callback extends Component {

    componentWillMount() {
        setAccessToken();
        setIdToken();
        window.location.href = "/";
    }

    render() {
        return null;
        /*return(
            <Redirect to='/'/>
        )*/
    }
}

export default Callback;