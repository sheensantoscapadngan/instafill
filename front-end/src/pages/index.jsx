import React from 'react';
import './index.css';
import {Button, Navbar} from '../components/common';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faPen } from '@fortawesome/free-solid-svg-icons';
import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';
library.add(faUpload, faPen)

const MainPage = () =>{
    return(
        <div>
                  <div className="buttons">
      <Button /*onClick={()=> {console.log("hello world")}}*/
      type="button"
      buttonStyle="btn--primary--solid"
      buttonSize="btn--large">
        <p className="filler">/</p>
        <p className="filler">/</p>

        <FontAwesomeIcon icon="upload"/>
        <p className="biggerText">Upload file</p>
        <p className="smallerText">Upload your blank pdf files here!</p>

        <p className="filler">/</p>
        <p className="filler">/</p>
        <p className="filler">/</p>
      </Button>
      <Button
      type="button"
      buttonStyle="btn--primary--solid"
      buttonSize="btn--large">
        <p className="filler">/</p>
        <p className="filler">/</p>

        <FontAwesomeIcon icon="upload"/>
        <p className="biggerText">Upload Master</p>
        <p className="smallerText">Upload your master document here!</p>

        <p className="filler">/</p>
        <p className="filler">/</p>
        <p className="filler">/</p>

      </Button>
      <Link to='/createMaster'>
        <Button 
      type="button"
      buttonStyle="btn--primary--solid"
      buttonSize="btn--large">
        <p className="filler">/</p>
        <p className="filler">/</p>

        <FontAwesomeIcon icon="pen"/>
        <p className="biggerText">Create Master</p>
        <p className="smallerText">Create your master document here!</p>

        <p className="filler">/</p>
        <p className="filler">/</p>
        <p className="filler">/</p>

        </Button>
        </Link>
     </div>
        </div>
    )
}
export default MainPage;