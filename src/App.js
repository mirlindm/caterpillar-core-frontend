import React, {Component} from 'react';

import {w3cwebsocket as W3CWebSocket } from 'websocket';
import ls from 'local-storage';

import './App.css';

import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import About from './components/About/About.jsx';
import Welcome from './components/Welcome/Welcome.jsx';
import NavigationBar from './components/NavigationBar/NavigationBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Login from './components/Login/Login.jsx';
import Logout from './components/Logout/Logout.jsx';
import Registry from './components/Registry/Registry.jsx';
import RuntimeRegistry from './components/Registry/RuntimeRegistry.js';
import CompilationEngine from './components/bpmn/CompilationEngine';
import InterpretationEngine from './components/bpmn/InterpretationEngine';
import Error from './components/Error/Error.jsx';
import AccessAllocation from './components/Policies/AccessAllocation';



//import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute.jsx';

const client = new W3CWebSocket('ws://127.0.0.1:8090');

class App extends Component {

  componentWillMount() {
  
    client.onopen = () => {
      console.log('WebSocket Client Connected from App.js');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      const step2 = JSON.parse(dataFromServer.policyInfo);
      console.log(step2.contractAddress);
      //check here if the info from the message (the name) is access control, then set the ls like below, 
      // else - set the ls for the role binding policy, else for the task role map ... 
      ls.set('accessControlAddress', step2.contractAddress)
    };
  }

  
  render() {
    
      const marginTop = {
        marginTop: "30px"
      }; 

  return (                              
             <Router>
              <NavigationBar />

              {/* <BpmnModelerComponent></BpmnModelerComponent> */}
              <Container>
                <Row>
                  <Col lg={12} style={marginTop}>
                    <Switch>
                      <Route path="/" exact component={Welcome} />
                      <Route path="/login" exact component={Login} />
                      <Route path="/welcome" exact component={Welcome} />
                      <Route path="/registry" exact component={Registry} />
                      <Route path="/compilation" exact component={CompilationEngine} />                    
                      <Route path="/interpretation" exact component={InterpretationEngine} />                    
                      {/* <Route path="/compilation" exact component={CCreateModel} />*/}
                      {/* <Route path="/interpretation" exact component={ICreateModel} />*/}
                      <Route path="/access" exact component={AccessAllocation} />                    
                      <Route path="/runtimeRegistry" exact component={RuntimeRegistry} />                    
                      <Route path="/logout" exact component={Logout} />
                      <Route path="/about" exact component={About} />

                      <Route component={Error} />
                    </Switch>
                    
                    </Col>
                  </Row>
                </Container>
            
              <Footer/>
             </Router> 

  

              // <Router>
              //   <NavigationBar/>
                  
              //       <div class="container" style={marginTop}>      
              //           <Switch>
              //               <Route path="/" exact component={Login}/>
              //               <Route path="/login" component={Login}/>
              //               <AuthenticatedRoute path="/welcome/:username" component={Welcome} />
              //               <AuthenticatedRoute path="/registry" component={Registry} />
              //               <AuthenticatedRoute path="/modeler" component={BpmnModelling} />
              //               <AuthenticatedRoute path="/logout" component={Logout}/>
              //               <AuthenticatedRoute path="/about" component={About} />
              //               <Route component={Error}/>
              //           </Switch>
                        
              //       </div>
              //       <Footer/>
              //   </Router>

  );
}
}

export default App;
