import React, { useState, useEffect } from 'react';
import './App.css';
import {Button, Navbar} from './components/common';
import {BrowserRouter as Router} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faPen } from '@fortawesome/free-solid-svg-icons';
library.add(faUpload, faPen)

function App() {
  return (  
    <Router>
      <Navbar/>
      <div className="buttons">
      <Button /*onClick={()=> {console.log("hello world")}}*/
      type="button"
      buttonStyle="btn--primary--solid"
      buttonSize="btn--large">
        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>

        <FontAwesomeIcon icon="upload"/>
        <p className="biggerText">Upload file</p>
        <p className="smallerText">Upload your blank pdf files here!</p>

        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>
      </Button>
      <Button
      type="button"
      buttonStyle="btn--primary--solid"
      buttonSize="btn--large">
        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>

        <FontAwesomeIcon icon="upload"/>
        <p className="biggerText">Upload Master</p>
        <p className="smallerText">Upload your master document here!</p>

        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>

      </Button>
      <Button
      type="button"
      buttonStyle="btn--primary--solid"
      buttonSize="btn--large">
        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>

        <FontAwesomeIcon icon="pen"/>
        <p className="biggerText">Create Master</p>
        <p className="smallerText">Create your master document here!</p>

        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>
        <p className="filler">lorem ipsum</p>

      </Button>
  </div>
  
    </Router>
  );
}

export default App;
