import React, { Component } from 'react';
import {setIdToken, setAccessToken, getIdToken} from './AuthMan';
import { Redirect } from 'react-router-dom';

class Callback extends Component {

    componentWillMount() {
        setAccessToken();
        setIdToken();
    }

    render() {
        return(
            <Redirect to='/'/>
        )
    }
}

export default Callback;