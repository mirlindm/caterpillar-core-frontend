import React, { Component } from 'react';
import {Toast} from 'react-bootstrap';

export default class RegistryToast extends Component {
    render () {
        const toastCss = {
            position: "fixed",
            top: '10px',
            right: '10px',
            zIndex: '1',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
        };

        return(
            <div style={this.props.children.show ? toastCss : null} >
                <Toast className={"border border-info bg-info text-white"} style={{fontSize: "15px"}} show={this.props.children.show}>
                    <Toast.Header className={"bg-info text-white"} closeButton={false}>
                        <strong className="mr-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body style={{fontSize: "15px"}}>
                        {this.props.children.message}
                    </Toast.Body>
                </Toast>
            </div>

        );
    }
}
