import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import NavigationBar from './components/NavigationBar/NavigationBar';
import Welcome from './components/Welcome/Welcome';
import Footer from './components/Footer/Footer';
import Registry from './components/Registry/Registry';
import About from './components/About/About';
import Login from './components/Login/Login'
// import BpmnModelerComponent from './components/bpmn/bpmn.modeler.component';
import BpmnModelling from './components/bpmn/BpmnModelling';


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
                <Route path="/registry" exact component={Registry} />
                <Route path="/modeler" exact component={BpmnModelling} />
                <Route path="/login" exact component={Login} />
                <Route path="/about" exact component={About} />
              </Switch>
              
             {/* <Registry /> */}
            </Col>
          </Row>

          {/* <Row>
            <Col lg={12} style={marginTop}>
              <Registry/>
            </Col>
          </Row> */}
          
        </Container>
        
        <Footer/>
      </Router>
    );
  }
}

export default App;
