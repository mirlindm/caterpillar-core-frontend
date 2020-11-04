import React, {Component} from 'react';

import {Redirect} from 'react-router-dom';

import {Modal, Button} from 'react-bootstrap';

import './Logout.css'

class Logout extends Component {
    state = {
        redirect: false,
        show: false
      }

    componentDidMount() {
        this.id = setTimeout(() => this.setState({ redirect: true }), 10000)
      }

    componentWillUnmount() {
        clearTimeout(this.id)
      }

    handleClose = () => this.setState({show: false});

    handleShow = () => this.setState({show: true});

    redirectToLoginHandler = () =>  this.props.history.push('/login/');
    
    render() {
        return(

        <div style={{margin: "40px"}}>
            <hr className="style-one" />

            <h2 className="heading-two" onClick={this.handleShow} style={{color: "white", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}> You are logged out </h2>
            {/* <Alert onClick={this.handleShow} style={{margin: "auto", cursor: "pointer", marginRight: "200px", marginLeft: "200px", fontSize: "20px", textAlign: "center", color: "black"}} variant="info">
                    <a>You are logged out </a> <br/>
            </Alert> */}


            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>You are logged out!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Thank you for using Caterpillar!</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                    Close
                
                    </Button>
                    <Button variant="primary" onClick={this.redirectToLoginHandler}>
                    Login
                    </Button>
                </Modal.Footer>
            </Modal>

            <div onClick={this.handleShow} className="container text-muted" style={{ fontSize: "20px", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}> 
                Thank you for using Caterpillar! <br/> <br/>
                <span style={{color: "white"}}>
                You will be redirected to the Login Page
                </span>
            
                {
                    this.state.redirect
                    ? <Redirect to="/login" />
                    : null
                }

            </div>
            <hr className="style-one" />
        </div>
        );
    }
}


export default Logout;