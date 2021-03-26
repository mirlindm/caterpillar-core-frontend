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
import CompilationEngine from './components/bpmn/CompilationEngine';
import InterpretationEngine from './components/bpmn/InterpretationEngine';
import Error from './components/Error/Error.jsx';
import AccessAllocation from './components/Policies/AccessAllocation';
import AccessControl from './components/Policies/AccessControl'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {      
        accessControlAddressFromWebSocket: '',
    }
}
       
  render() {
    
    const marginTop = {
        marginTop: "30px"
    }; 

      return (                              
             <Router>               
              <NavigationBar />
             
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
                      <Route path="/access" exact component={AccessAllocation} />                    
                      <Route path="/policies" exact component={AccessControl} />                    
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

  );
}
}

export default App;
