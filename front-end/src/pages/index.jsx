import React from 'react';
import './index.css';
import {Button, Popup, Dropzone } from '../components/common';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faPen } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import  { useState } from 'react';

library.add(faUpload, faPen)

const MainPage = () =>{


  const [buttonPopup, setButtonPopup] = useState(false);

    return(
        <div>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <div>
            <Dropzone></Dropzone>
              
            </div>
          </Popup>
          
        
          <div className="buttons">

            <Button
              type="button"
              buttonStyle="btn--primary--solid"
              buttonSize="btn--large"
              onClick={() => setButtonPopup(true)}>
              <FontAwesomeIcon icon="upload"/>
              <p className="biggerText">Upload file</p>
              <p className="smallerText">Upload your blank pdf files here!</p>
            </Button>

            <Button
              type="button"
              buttonStyle="btn--primary--solid"
              buttonSize="btn--large"
              onClick={() => setButtonPopup(true)}>
              <FontAwesomeIcon icon="upload"/>
              <p className="biggerText">Upload Master</p>
              <p className="smallerText">Upload your master document here!</p>
            </Button>

            <Link to='/createMaster'>
              <Button 
                type="button"
                buttonStyle="btn--primary--solid"
                buttonSize="btn--large">
                <FontAwesomeIcon icon="pen"/>
                <p className="biggerText">Create Master</p>
                <p className="smallerText">Create your master document here!</p>
              </Button>
            </Link>
          </div>
        </div>
    )
}

export default MainPage;