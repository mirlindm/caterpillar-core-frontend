import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

import AuthenticationService from '../AuthenticationService/AuthenticationService.js';

class AuthenticatedRoute extends Component {
    render() {
        
            if(AuthenticationService.isUserLoggedIn()){
               return <Route {...this.props} />
            } else {
                return <Redirect to="/logout" />
        }
    }
}

export default AuthenticatedRoute;