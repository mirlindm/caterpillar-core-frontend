import React, {Component} from 'react';
import './App.css';

import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import About from './components/About/About';
import Welcome from './components/Welcome/Welcome';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Registry from './components/Registry/Registry';
import BpmnModelling from './components/bpmn/BpmnModelling';
import Error from './components/Error/Error';

import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute';


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
            <Route path="/" exact component={Login} />
            <AuthenticatedRoute path="/welcome/:username" component={Welcome} />
            <AuthenticatedRoute path="/registry" component={Registry} />
            <AuthenticatedRoute path="/modeler" component={BpmnModelling} />
            <Route path="/login" component={Login} />
            <AuthenticatedRoute path="/logout" component={Logout} />
            <AuthenticatedRoute path="/about" component={About} />

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
