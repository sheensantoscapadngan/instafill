import {Navbar} from '../components/common';
import React, { useState,useEffect,useRef} from 'react';

import './EditPDF.css';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class TextObject{
  constructor(value,x,y,width,height){
    this.value = value
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

const EditPDF = (props) => {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textObjects, setTextObjects] = useState([])
  const [pdfContext, setPdfContext] = useState(null)
  const [pdfCanvas, setPdfCanvas] = useState(null)
  const [pdfCanvasImages,setPdfCanvasImages] = useState({})
  const [canvasBounds,setCanvasBounds] = useState(null)
  const [canvasOffset, setCanvasOffset] = useState({x:0,y:0})
  const [attachedMouseEvent,setAttachedMouseEvent] = useState(false)

  let startPosition = {x:0,y:0}
  let holdState = false
  let currentHoldIter = null


  useEffect(()=>{
    if(pdfCanvas != null){
      console.log("CALLED!")
      if(!attachedMouseEvent && canvasBounds != null){
        attachMouseListeners()
        setAttachedMouseEvent(true)
      }
      displayTextObjects()
    }
  },[textObjects,canvasBounds])

  useEffect(()=>{
    if(pdfCanvas != null){
      console.log("ATTACHED PDF CANVAS")
      let bounds = pdfCanvas.getBoundingClientRect()
      let offset = {x:bounds.left,y:bounds.top}
      
      setCanvasBounds(bounds)
      setCanvasOffset(offset)   
    }
  },[pdfCanvas])


  const onDocumentLoadSuccess=({ numPages })=>{
    setNumPages(numPages);
  } 

  const onPageRenderSuccess=()=>{
    let canvas = document.querySelector('.react-pdf__Page__canvas');
    let context = canvas.getContext("2d")
    let pageImg = context.getImageData(0, 0, canvas.width, canvas.height)

    context.font = "16px verdana"

    setPdfCanvasImages({...pdfCanvasImages,[pageNumber]:pageImg})
    setPdfContext(context)
    setPdfCanvas(canvas)
  }

  const nextPage=()=>{
    if(pageNumber+1 <= numPages)
      setPageNumber(pageNumber+1)
  }
  
  const prevPage=()=>{
    if(pageNumber-1 > 0)
      setPageNumber(pageNumber-1)
  } 

  const checkClickIntersection=(position)=>{
    let objects = null
    setTextObjects(textObjects=>{
      objects = textObjects
      return textObjects
    })
    
    let hit = false
    for(let iter in objects){
      let text = objects[iter]
      hit = (position.x >= text.x && position.x <= text.x + text.width
          && position.y >= text.y - text.height && position.y <= text.y)
      if(hit){
        holdState = true
        currentHoldIter = iter
        break
      }
    }
    if(!hit){
      createTextObject(position)
    }
  }

  const getNormalizedClickPositions=(e)=>{
    let x = e.pageX - canvasOffset.x
    let y = e.pageY - canvasOffset.y

    x /= canvasBounds.width
    y /= canvasBounds.height
    x *= pdfCanvas.width
    y *= pdfCanvas.height
    return [x,y]
  }

  const handleMouseDown=(e)=>{
    e.preventDefault()
    if(e.button == 0){
      let pos = getNormalizedClickPositions(e)
      startPosition = {x:pos[0],y:pos[1]}
      checkClickIntersection(startPosition)
    }
  }

  const handleMouseMove=(e)=>{
    e.preventDefault()
    if(holdState){
      let pos = getNormalizedClickPositions(e)
      let movePosition = {x:pos[0],y:pos[1]}
      moveTextObject(movePosition)
    }
  }

  const handleMouseUp=(e)=>{
    e.preventDefault()
    holdState = false
    currentHoldIter = null
  }

  const attachMouseListeners=()=>{
  
    pdfCanvas.addEventListener('mousedown',handleMouseDown,true)
    pdfCanvas.addEventListener('mousemove',handleMouseMove,true)
    pdfCanvas.addEventListener('mouseup',handleMouseUp,true)
    
  }

  const moveTextObject=(movePosition)=>{
    let objects = null
    setTextObjects(textObjects=>{
      objects = textObjects
      return textObjects
    })

    objects[currentHoldIter].x = movePosition.x
    objects[currentHoldIter].y = movePosition.y
   
    setTextObjects([...objects])
  }

  const createTextObject=(pos)=>{
    let value = "sheen"
    let width = pdfContext.measureText(value).width
    let height = 16  
    let objects = []

    setTextObjects(textObjects=>{
      objects = textObjects
      return textObjects
    })

    let text = new TextObject(value,pos.x,pos.y,width,height)
    setTextObjects(objects=>([...objects,text]))
  }

  const displayTextObjects=()=>{
    let defaultCanvas = pdfCanvasImages[pageNumber]
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height)
    pdfContext.putImageData(defaultCanvas,0,0)

    for(let iter in textObjects){
      let textObject = textObjects[iter]
      pdfContext.fillText(textObject.value,textObject.x,textObject.y)
    }
  }

  return (
    <div >
        <Navbar fillerCount={props.fillerCount}/>
        <Document
          file={props.pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber}
              onRenderSuccess={onPageRenderSuccess}
            />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        <button onClick={nextPage}>Next</button>
        <button onClick={prevPage}>Previous</button>
    </div>
  );
}

export default EditPDF;