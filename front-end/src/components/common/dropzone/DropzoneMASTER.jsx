import React, { useCallback, Component } from 'react';
import './Dropzone.css'

import styled from 'styled-components';
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';

import {useDropzone, FileError, FileRejection} from 'react-dropzone';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

library.add(faFileInvoice)

/*const getColor = (props) => {
  /*if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }///
  return '#00abeb';
}

const Container = styled.div`

  border-color: ${props => getColor(props)};

`;




const DropzoneMASTER = ({setFileUploadMASTER}) => {

  
  const onDrop = useCallback(acceptedFiles =>{
    setFileUploadMASTER(acceptedFiles);
    ///let formData = new FormData()
    formData.append('master',acceptedFiles[0])

    
    
    axios({
      url: '/process',
      method: "POST",
      headers:{
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then((res)=>{
      
    })///

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
export default DropzoneMASTER;*/


const DropzoneMASTER = ({setFileUploadMASTER}) => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' } /* filler ra ni guys para mu gana ang progress bar*/
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (file,allFiles) => {
    setFileUploadMASTER(file.map(f => f.file))
    console.log(file.map(f => f.file))
    allFiles.forEach(f => f.remove())
    
  }

  return (
    <div className="inner-container">
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      maxFiles={1}
      accept=".txt"
      inputContent={
      <div className="inputContent">
      <p className="filler">_____________________________________________<FontAwesomeIcon icon="file-invoice" color="	#228B22" size="3x"/>_____________________________________________</p>
      <h2>DROP MASTER HERE OR <span className="browse">CLICK TO BROWSE</span></h2>
      <p className="filler">_______________________________________________________________________________________________</p>
      </div>
      }
      styles={{ dropzone: { minHeight: 400, maxHeight: 250 } }}
      
    />
    </div>
  )
}

<DropzoneMASTER />
export default DropzoneMASTER;