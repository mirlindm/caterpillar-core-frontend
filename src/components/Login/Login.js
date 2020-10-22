import React, { Component } from 'react';

// import InvalidCredentials from './InvalidCredentials';
// import SuccessLogin from './SuccessLogin';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Button, Form} from 'react-bootstrap';

import './Login.css'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: false
        }
    }

        inputChangeHandler = (event) => {
             this.setState({
                 [event.target.name]: event.target.value
             })
        }

        loginClicked = (event) => {
            event.preventDefault();

            // mirlind, pass - temporal hardcoded credentials
            if(this.state.username === 'mirlind' && this.state.password === 'pass' ) {
                this.props.history.push(`/welcome/${this.state.username}`);
                // this.setState({showSuccessMessage: true})
                // this.setState({hasLoginFailed: false})
            }
            else {

                this.setState({showSuccessMessage: false})
                this.setState({hasLoginFailed: true})
            }
        }

    render() {
        return (
            <div> 
                <div className="outer">
                    <div className="inner">
                    <form>
                        <h3 style={{color: "white"}}>Log in to use Caterpillar <hr style={{backgroundColor: "#008B8B"}} /> </h3>  

                        {/* <InvalidCredentials hasLoginFailed={this.state.hasLoginFailed}/> */}
                        {this.state.hasLoginFailed && <div>Invalid Credentials</div>}
                        {this.state.showSuccessMessage && <div>Login Successful</div>}
                        {/* <SuccessLogin showSuccessMessage={this.state.showSuccessMessage} /> */}
                    
                        <div className="form-group">
                            <label className="text-white">Username</label>
                            <input type="username" name="username" className="form-control" placeholder="Enter email" onChange={this.inputChangeHandler} />
                            <Form.Text className="text-muted">
                            We'll never share your username with anyone else.
                            </Form.Text>
                        </div>

                        <div className="form-group">
                            <label className="text-white">Password</label>
                            <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={this.inputChangeHandler} />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label text-white" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div>

                        <Button variant="outline-info" type="submit" className="btn btn-dark btn-lg btn-block" onClick={this.loginClicked}>Sign in</Button>
                        <p className="forgot-password text-right">                
                        </p>
                    </form>
                    
                </div>
                    <div style={{marginTop: "65px"}}></div>
                </div>
         </div>
        );
    }
}