import React, { useEffect, useState } from "react";
import Modeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import * as propertiesPanelModule from "bpmn-js-properties-panel";
import * as propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/bpmn";


const TestModeller = () => {

    const containerId = document.getElementById("canvas");
    const parentId = document.getElementById("js-properties-panel");

    const modeler = new Modeler({
        container: containerId,
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
        ],
        propertiesPanel: {
          parent: parentId
        }
      });

    return (
        <div>
            
            <div id="canvas"></div>
            <div id="js-properties-panel"></div>

        </div>
    )

};

export default TestModeller;

