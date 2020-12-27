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
import BpmnModelling from './components/bpmn/BpmnModelling';
import Error from './components/Error/Error.jsx';


import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute.jsx';


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
                      <Route path="/login" exact component={Login} />
                      <AuthenticatedRoute path="/welcome/:username" exact component={Welcome} />
                      <AuthenticatedRoute path="/registry" exact component={Registry} />
                      <AuthenticatedRoute path="/modeler" exact component={BpmnModelling} />                    
                      <Route path="/logout" exact component={Logout} />
                      <AuthenticatedRoute path="/about" exact component={About} />

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
