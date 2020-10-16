import React from 'react';

import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "./styles.css";

import diagram from "./diagram.bpmn";

function TestingBPMN() {
    
        const container = document.getElementById("container");
        const ppp = document.getElementById("properties-panel-parent");

        const modeler = new Modeler({
        container,
        keyboard: {
            bindTo: document
        },
        additionalModules: [propertiesPanelModule, propertiesProviderModule],
        propertiesPanel: {
            parent: ppp
        }
        });

        modeler
        .importXML(diagram)
        .then(({ warnings }) => {
            if (warnings.length) {
            console.log(warnings);
            }

            const canvas = modeler.get("canvas");

            canvas.zoom("fit-viewport");
        })
        .catch(err => {
            console.log(err);
        });

        return(
            <div>
                <div id="container"></div>
	            <div id="properties-panel-parent"></div>
            </div>
        );
    
}

export default TestingBPMN;