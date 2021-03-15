import React, { useCallback, Component } from 'react';
import './Dropzone.css'

import styled from 'styled-components';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import {useDropzone, FileError, FileRejection} from 'react-dropzone';

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




const DropzoneMASTER = ({setFileUploadMASTER}) => {

  
  const onDrop = useCallback(acceptedFiles =>{
    setFileUploadMASTER(acceptedFiles);
    /*let formData = new FormData()
    formData.append('master',acceptedFiles[0])

    
    
    axios({
      url: '/process',
      method: "POST",
      headers:{
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then((res)=>{
      
    })*/

  }, [])
  
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({accept: '.txt',onDrop});

  
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

<DropzoneMASTER />
export default DropzoneMASTER;


