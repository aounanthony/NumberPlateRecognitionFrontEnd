import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './ressources/image.css';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import MapComp from './components/Map';
import Settings from './components/Settings';
import blacklistTable from './components/blacklistTable';

import 'bootstrap/dist/css/bootstrap.min.css';



class App extends Component {
  render() {
    return (
      
      <Provider store = { store }>
        <Router>
            <div>
              <Navbar />
              <div className="imageCss">
                <Route exact path="/blacklistTable" component={ blacklistTable } />
                <Route exact path="/settings" component={ Settings } />
                <Route exact path="/" component={ Home } />
                <div className="container">
                  <Route exact path="/register" component={ Register } />
                  <Route exact path="/login" component={ Login } />
                </div>
              </div>
            </div>
            <div>
                <Route exact path="/Map" component={ MapComp } />
            </div>
          </Router>
        </Provider>
    );
  }
}

export default App;