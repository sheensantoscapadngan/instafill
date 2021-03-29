import {Navbar} from '../components/common';
import React, { useState,useEffect,useRef} from 'react';

import './EditPDF.css';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const EditPDF = (props) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const nextPage=()=>{
    if(pageNumber+1 <= numPages)
      setPageNumber(pageNumber+1)
  }
  
  const prevPage=()=>{
    if(pageNumber-1 > 0)
      setPageNumber(pageNumber-1)
  }

  return (
    <div >
        <Navbar fillerCount={props.fillerCount}/>
        <Document
          file={props.pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        <button onClick={nextPage}>Next</button>
        <button onClick={prevPage}>Previous</button>
    </div>
  );
}

export default EditPDF;