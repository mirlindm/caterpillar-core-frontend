import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 

import NavigationBar from './components/NavigationBar';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
//import Registry1 from './components/Registry';
import Registry from './components/Registry/Registry';
import About from './components/About';

class App extends Component {


  render() {
    const marginTop = {
      marginTop: "40px"
    };

    return (
      <Router>
        <NavigationBar />
        
        <Container>
          <Row>
            <Col lg={12} style={marginTop}>
              <Switch>
                <Route path="/" exact component={Welcome} />
                <Route path="/registry" exact component={Registry} />
                <Route path="/login" exact  />
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
