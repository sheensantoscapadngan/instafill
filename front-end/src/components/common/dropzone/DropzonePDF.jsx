import React, { useCallback } from 'react';
import './Dropzone.css'
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import * as pdflib from '../../../pdflib/processPdf.js'; 
library.add(faUpload)

const getColor = (props) => {
  /*if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }*/
  return '#00abeb';
}

const Container = styled.div`

  border-color: ${props => getColor(props)};

`;


function DropzonePDF(props) {

  const onDrop = useCallback(acceptedFiles =>{
    let formData = new FormData()
    formData.append('pdf',acceptedFiles[0])

    /*pdflib.preprocessPdf(acceptedFiles[0])*/

    axios({
      url: '/process',
      method: "POST",
      headers:{
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then((res)=>{
      
    })

  }, [])
  
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({accept: '.pdf, .txt',onDrop});



  
  return (
    <div className="container">
      <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})} className="inner-container">
        <input {...getInputProps()} />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <FontAwesomeIcon icon="upload" size="3x"/>
        <br></br>
        <br></br>
        <br></br>
        <h1>DROP FILES HERE OR <span className="browse">BROWSE</span></h1>
        <br></br>
        <br></br>
        <p>Drag and drop files in this area for quick upload to the cloud or use file explorer</p>
        

      </Container>
    </div>
  );
}

<DropzonePDF />
export default DropzonePDF;

