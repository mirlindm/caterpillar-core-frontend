import React, {Component} from 'react';
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
import BpmnModelling from './components/bpmn/BpmnModelling';
import CCreateModel from './components/bpmn/Compilation/CCreateDiagram';
import CUploadModel from './components/bpmn/Compilation/CUploadDiagram';
import Error from './components/Error/Error.jsx';
import AccessAllocation from './components/Policies/AccessAllocation';



//import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute.jsx';


class App extends Component {

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
                      <Route path="/modeler" exact component={BpmnModelling} />                    
                      <Route path="/createModel" exact component={CCreateModel} />                    
                      <Route path="/uploadModel" exact component={CUploadModel} />                    
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
