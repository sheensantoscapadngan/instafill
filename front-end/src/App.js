import './App.css';
import React, { useState, useEffect } from 'react';
import {Button, Navbar} from './components/common';

import Background from './background.svg';
import {BrowserRouter as Router} from 'react-router-dom';
function App() {
  return (  
    <Router>
      <Navbar/>
      {/*<div className="buttons">
      <Button onClick={()=> {console.log("hello world")}}
      type="button"
      buttonStyle="btn--primary--outline"
      buttonSize="btn--large"
      ></Button>
      <Button onClick={()=> {console.log("hello world")}}
      type="button"
      buttonStyle="btn--primary--outline"
      buttonSize="btn--large"
      ></Button>
      <Button onClick={()=> {console.log("hello world")}}
      type="button"
      buttonStyle="btn--primary--outline"
      buttonSize="btn--large"
  ></Button>
  </div>*/}
  
    </Router>
  );
}

export default App;
