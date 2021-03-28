import {Navbar} from '../components/common';
import React, { useState } from 'react';
import './EditPDF.css';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const EditPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState([]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div >

        <Navbar/>
      <Document
        file="sample.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
         <Page pageNumber={pageNumber} />
      </Document>
 
      <p>Page {pageNumber} of {numPages}</p>

    </div>
  );
}

export default EditPDF;