import React, { useState, useEffect } from 'react';
import './App.css';
import {Button, Navbar} from './components/common';
import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';


//Pages
import MainPage from './pages/index';
import createMaster from './pages/createMaster';

function App() {
  return (  
    <Router>
      <Navbar/>
      <Switch>
        <Route exact path='/' component={MainPage}/>
        <Route exact path='/createMaster' component={createMaster}/>
      </Switch>
    </Router>
  );
}

export default App;
