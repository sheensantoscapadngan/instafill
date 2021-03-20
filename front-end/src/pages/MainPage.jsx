import React, {useState,useContext} from 'react';
import './MainPage.css';
import './tooltip.css';
import {Button, Popup, DropzoneMASTER, DropzonePDF, Navbar} from '../components/common';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faPen } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import axios from 'axios';

library.add(faUpload, faPen)

//messages for popup
function FirstButton(){
  return(
    "Upload your blank pdf files here for instant fill up of information! Don't forget to upload your master file as well. Sit back and we'll do the rest."
  );
};
function SecondButton(){
  return(
    "Upload your master document here! The master document will be used for the instant fill up.\nDon't have a master document yet? You can also create your own now!"
  );
};
function ThirdButton(){
  return(
    "Start creating your own master document here! The master document makes the magic work. It's completely quick and easy!"
  );
};
const MainPage = (props) =>{

  const  pageVariants = {
    in: {
      opacity: 1,
      y: 0
    },
    out:{
      opacity: 1,
      y: "-100vh",
    
    }
  };

  const pageTransition = {
    type: "spring"

  }

  const [buttonPopupPDF, setButtonPopupPDF] = useState(false);
  const [buttonPopupMASTER, setButtonPopupMASTER] = useState(false);

  const [fileUploadPDF, setFileUploadPDF] = useState([])
  const [fileUploadMASTER, setFileUploadMASTER] = useState([])

  const clearState = () =>{
    setFileUploadPDF([]);
    setFileUploadMASTER([]);
  }

  if(fileUploadMASTER.length == 1 && fileUploadPDF.length == 1){
    let formData = new FormData()
    formData.append('master',fileUploadMASTER[0])
    formData.append('pdf', fileUploadPDF[0])
    

    clearState();
    axios({
      url: '/process',
      method: "POST",
      headers:{
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then((res)=>{ 
      
    })
    window.location = "/editPDF";

    
  }
    return(
      <div className="MainPage" >
        <Navbar fillerCount={props.fillerCount}/>
        <motion.div initial="out" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
          

          
        
          <div className="buttons">
            <view 
              className = "stylish"
              data-tooltip = {FirstButton()}> 
              <Button
              type="button"
              buttonStyle="btn--primary--solid"
              buttonSize="btn--large"
              onClick={() => setButtonPopupPDF(true)}>
              <FontAwesomeIcon icon="upload"/>
              <p className="biggerText">Upload file</p>
              <p className="smallerText">Upload your blank pdf files here!</p>
            </Button>
            </view>

            <view
            className = "stylish"
            data-tooltip = {SecondButton()}>
            <Button
              type="button"
              buttonStyle="btn--primary--solid"
              buttonSize="btn--large"
              onClick={() => setButtonPopupMASTER(true)}>
              <FontAwesomeIcon icon="upload"/>
              <p className="biggerText">Upload Master</p>
              <p className="smallerText">Upload your master document here!</p>
            </Button>

            </view>
            

            <view 
              className = "stylish"
              data-tooltip = {ThirdButton()}>
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
            </view>
          </div>
        </motion.div>
        <Popup trigger={buttonPopupPDF} setTrigger={setButtonPopupPDF}>
            <div>
            <DropzonePDF setFileUploadPDF={setFileUploadPDF}></DropzonePDF>
              
            </div>
          </Popup>
          <Popup trigger={buttonPopupMASTER} setTrigger={setButtonPopupMASTER}>
            <div>
            <DropzoneMASTER setFileUploadMASTER={setFileUploadMASTER}></DropzoneMASTER>
              
            </div>
          </Popup>
        </div>
    )


}

export default MainPage;