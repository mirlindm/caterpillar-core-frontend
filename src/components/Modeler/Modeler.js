import React, { Component } from 'react';

import ReactBpmn from 'react-bpmn';
import Modeler from 'bpmn-js/lib/Modeler';


import customModdleExtension from './custom.json';

class BpmnModeler extends Component {



    onShown = (event) => {
        console.log('diagram shown');
    }

    onLoading = (event) => {
        console.log('diagram loading');
    }

    onError = (event) => {
        console.log('failed to show diagram');
    } 

    render() {

        const $modelerContainer = document.querySelector('#modeler-container');
        const $propertiesContainer = document.querySelector('#properties-container');

        const modeler = new Modeler({
            container: $modelerContainer,
            moddleExtensions: {
              custom: customModdleExtension
            },
            keyboard: {
              bindTo: document.body
            }
          });
          
          


        return(
            <div class="modeler-parent">
                <div id="modeler-container"></div>
                <div id="properties-container"></div>
          </div>
        );
    }
}

export default Modeler;