import React, { Component } from 'react';

import {Card, Form, Button, Col} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';


class Registry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registry: ''
        }

        this.registryChangeHandler = this.registryChangeHandler.bind(this);
        this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }

    createRegistryHandler(event) {
        alert('registry code: ' + this.state.registry);
        event.preventDefault();
    }

    registryChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    


    render () {
        return (
            <div className="text-white">
                {/* <p>Perform Runtime Registry related HTTP Requests</p> */}
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>Runtime Registry related HTTP Requests</Card.Header>
                    <Form onSubmit={this.createRegistryHandler} id="registry">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridTitle" >
                                    <Form.Label>Registry Code</Form.Label> 
                                    <Form.Control required
                                        type="text"
                                        name="registry"
                                        value={this.state.registry}
                                        onChange={this.registryChangeHandler}
                                        className={"bg-dark text-white"}
                                        placeholder="Enter Registry Code" />
                                </Form.Group>
                            </Form.Row>
                        
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button variant="success" type="submit">
                            <FontAwesomeIcon icon={faPlus} /> Create
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default Registry;