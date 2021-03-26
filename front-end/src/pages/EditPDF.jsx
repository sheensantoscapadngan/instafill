import {Navbar} from '../components/common';
import React, { useState } from 'react';


import {DropzonePDF} from '../components/common';
import './EditPDF.css';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const EditPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState([]);
  const [fileUploadPDFs, setFileUploadPDFs] = useState();



  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div >

        <Navbar/>
        <div className="dont-display">
        <div className="editpdf">
            <DropzonePDF setFileUploadPDFs={setFileUploadPDFs}/> 
            </div>
      <Document
        file={fileUploadPDFs}
        onLoadSuccess={onDocumentLoadSuccess}
      >
         <Page pageNumber={pageNumber} />
      </Document>
      </div>
     
      <p>Page {pageNumber} of {numPages}</p>
      <p>Page {pageNumber} of {numPages}</p>
      <p>Page {pageNumber} of {numPages}</p>
      <h1>yolo</h1>
    </div>
  );
}

export default EditPDF;