import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 

import NavigationBar from './components/NavigationBar';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import Registry from './components/Registry';

class App extends Component {


  render() {
    const marginTop = {
      marginTop: "20px"
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
              </Switch>
              {/* <Welcome/>
              <Registry /> */}
            </Col>
          </Row>
        </Container>
        <Footer/>
      </Router>
    );
  }
}

export default App;
