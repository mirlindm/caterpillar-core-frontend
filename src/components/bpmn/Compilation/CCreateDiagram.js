import React, { Component } from "react";

import Aux from "../../../hoc/Auxiliary";

import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { emptyBpmn } from "../../../asset/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import { Card, Button } from "react-bootstrap";

import axios from 'axios';

// import BpmnModelerTest from '../Modeler/BpmnModeler';



class CCreateDiagram extends Component {
  modeler = null;

  // implement a method to fire the HTTP request from the backend

  saveModelHandler = (event) => {
    event.preventDefault();

     // post request to save the model
     // implement a method to run the request from the backend for POST Model - Compilation Engine

    axios.post("http://localhost:3000/models",{
      bpmn: "process model created by the user",
      name: "name provided by the user",
      "registryAddress": "address of the runtime registry created or provided by the user"
    })
    .then(response => {
        if(response.data != null) {
            console.log(response)
            this.setState({show: true, registry: response.data});
        } else {
            this.setState({show: false});
        }
        }).catch(e => console.log(e)
        );
  };

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
    this.openBpmnDiagram(emptyBpmn);
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

  
    // });
  };

  render = () => {
    return (
      <Aux>
        <div
          className="container text-white"
          style={{
            border: "1px solid #008B8B",
            borderRadius: "10px",
            marginBottom: "40px",
            marginTop: "40px"
          }}
        >
          <p
            style={{
              fontFamily: "Trocchi",
              color: "#008B8B",
              fontSize: "20px",
              fontWeight: "normal",
              lineHeight: "48px",
              textAlign: "center"
            }}
          >
            Create and Save Your Model Below
          </p>

          <div style={{ marginTop: "10px" }}> </div>
        </div>

        <Card
          className="bg-gray-dark "
          style={{ border: "2px solid #008B8B", width: "100%", height: "100%" }}
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
          style={{ border: "1px solid #008B8B", marginTop: "10px" }}
        >
          Save
        </Button>

        <div style={{ marginTop: "40px", paddingTop: "10px" }}></div>
      </Aux>
    );
  };
}

export default CCreateDiagram;
