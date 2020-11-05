import React, { Component } from "react";

import Aux from "../../../hoc/Auxiliary";

import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { paymentBpmn } from "../../../assets/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './CCreateDiagram.css';

import {Alert, Card, Button } from "react-bootstrap";

import axios from 'axios';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

class CCreateDiagram extends Component {
      modeler = null;

      constructor(props) {
        super(props);

        this.state = {            
            id: [],
         
        }
    }

      // ************* copying below the part for BPMN Plugin into componentDidMount
      
      componentDidMount = () => {
        this.modeler = new BpmnModeler({
          container: "#bpmnview",
          keyboard: {
            bindTo: window
          },
          propertiesPanel: {
            parent: "#propview"
          },
          additionalModules: [propertiesPanelModule, propertiesProviderModule],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        });

        this.newBpmnDiagram();
      };

      newBpmnDiagram = () => {
        this.openBpmnDiagram(paymentBpmn);
      };

      openBpmnDiagram = async (xml) => {
          try {
            const result = await this.modeler.importXML(xml);
            const { warnings } = result;
            console.log(warnings);

            var canvas = this.modeler.get("canvas");

            canvas.zoom("fit-viewport");

          } catch (err) {
            console.log(err.message, err.warnings);
          }
      };

      // *************

      saveModelHandler = (event) => {
        event.preventDefault();
    
         // post request to save/deploy the model
         // implement a method to run the request from the backend for POST Model - Compilation Engine
    
        axios.post("http://localhost:3000/models",{
          bpmn: paymentBpmn,
          name: "InsureIT Payment",
          registryAddress: "0x3043Ef1e4a0653e3a2C2BcDA6dcc5c4B0C6e97F2"
          })
          .then(response => {
              if(response.data != null) {
                  this.setState({id: response.data})
                  console.log(response)
                  // this.setState({show: true, registry: response.data});
              } else {
                console.log("Received Incorrect Response");
              }
            })
            .catch(e => console.log(e.toString()));
        };

  render = () => {
    return (
      <Aux>
        <div
          className="container text-white"
          style={{
            // borderBottom: "1px solid #008B8B",
            // width: "350px",
            // borderRadius: "10px",
            marginBottom: "20px",
            marginTop: "20px",
            textAlign: "center",
            marginLeft: "120px",
            marginRight: "120px"
          }}
        >
          
           <Alert style={{marginLeft: "-15px", fontSize: "20px", marginTop: "30px", marginBottom: "30px", borderRadius: "10px", marginRight: "225px", color: "black"}} size="sm" variant="info">
             Create and Save Your Model Below 
            </Alert> 
        

          <div style={{ marginTop: "10px" }}> </div>
        </div>

        <hr className="style-seven" style={{marginBottom: "0px"}} />

        <Card
          className="bg-gray-dark"
          style={{ border: "2px solid #008B8B", width: "110%", marginLeft: "-60px" , height: "100%" }}
        >
          <div id="bpmncontainer">
            <div
              id="propview"
              style={{
                width: "25%",
                height: "98vh",
                float: "right",
                maxHeight: "98vh",
                overflowX: "auto"
              }}
            ></div>
            <div
              id="bpmnview"
              style={{ width: "75%", height: "98vh", float: "left" }}
            ></div>
          </div>          
        </Card>

        <Button
          onClick={this.saveModelHandler}
          variant="primary"
          type="submit"
          className="link-button"
          style={{
                  marginLeft: "350px",
                  marginRight: "350px", 
                  width: "410px",
                  border: "1px solid #008B8B", 
                  marginTop: "20px",
                  marginBottom: "8px", 
                  padding: "5px", 
                  lineHeight: "35px",
                  fontSize: "17px", 
                  fontWeight: "normal",
                }}
        >
          Save Your Model
        </Button>

        <hr className="style-seven" style={{marginTop: "15px"}} />

          <span style={{"display": this.state.id !== [] ? "block" : "none" }}>
            <Alert variant="success" 
                   style={{color: "black",
                           marginTop: "-25px",                                          
                           fontSize: "17px", 
                           fontWeight: "normal",
                           borderRadius: "10px",
                           marginRight: "350px",
                           marginLeft: "350px",
                           textAlign: "center",
                          }}
            > 
              Bundle ID: <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.id.bundleID} </span>
            </Alert> 
          </span>

          

        <div style={{marginTop: "0px", paddingTop: "10px"}}></div>
      </Aux>
    );
  };
}

export default CCreateDiagram;
