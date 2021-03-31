import {Navbar} from '../components/common';
import React, { useState,useEffect,useRef} from 'react';
import {preprocessPdf} from '../pdflib/processPdf.js'

import './EditPDF.css';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class TextObject{
  constructor(value,x,y,width,height,fontSize){
    this.value = value
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fontSize = fontSize
  }
}

const EditPDF = (props) => {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textObjects, setTextObjects] = useState({})
  const [pdfContext, setPdfContext] = useState(null)
  const [pdfCanvas, setPdfCanvas] = useState(null)
  const [pdfCanvasImages,setPdfCanvasImages] = useState({})
  const [canvasBounds,setCanvasBounds] = useState(null)
  const [canvasOffset, setCanvasOffset] = useState({x:0,y:0})
  const [attachedMouseEvent,setAttachedMouseEvent] = useState(false)
  const [canvasDims,setCanvasDims] = useState([0,0])

  let startPosition = {x:0,y:0}
  let holdState = false
  let currentHoldIter = null

  useEffect(()=>{
    if(!attachedMouseEvent && pdfCanvas != null){
      attachMouseListeners()
      setAttachedMouseEvent(true)
    }
  },[canvasBounds])

  useEffect(()=>{
    if(pdfCanvas != null && canvasBounds != null){
      displayTextObjects()
    }
  },[textObjects,pdfCanvasImages,canvasBounds])

  useEffect(()=>{
    if(pdfCanvas != null){  
      let canvasImg = pdfCanvasImages[pageNumber]
      if(canvasImg == null) return
      pdfCanvas.width = canvasDims[0]
      pdfCanvas.height = canvasDims[1]
      
      let bounds = pdfCanvas.getBoundingClientRect()
      let offset = {x:bounds.left,y:bounds.top}

      setCanvasOffset(offset) 
      setCanvasBounds(bounds)  
    }
  },[pdfCanvas,canvasDims])

  const onDocumentLoadSuccess=({ numPages })=>{
    setNumPages(numPages);
  } 

  const onPageRenderSuccess=()=>{
    let canvas = document.querySelector('.react-pdf__Page__canvas');
    let context = canvas.getContext("2d")
  
    context.font = "16px verdana"
 
    let oldCanvas = canvas.toDataURL("image/png");
    let img = new Image();
    img.src = oldCanvas;
    img.onload = function (){
        setPdfCanvasImages({...pdfCanvasImages,[pageNumber]:img})
        setPdfContext(context)
        setPdfCanvas(canvas)
    }

  }

  const onPageLoadSuccess=({width,height})=>{
    if(canvasDims[0] != width && canvasDims[1] != height)
      setCanvasDims([width,height])

  }

  const nextPage=()=>{
    if(pageNumber+1 <= numPages)
      setPageNumber(pageNumber+1)
      setAttachedMouseEvent(false)
  }
  
  const prevPage=()=>{
    if(pageNumber-1 > 0)
      setPageNumber(pageNumber-1)
      setAttachedMouseEvent(false)
  } 

  const checkClickIntersection=(position)=>{
    let objects
    setTextObjects(textObjects=>{
      objects = {...textObjects}
      return textObjects
    })

    objects = objects[pageNumber]
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
    let objects
    setTextObjects(textObjects=>{
      objects = {...textObjects}
      return textObjects
    })

    let newObjects = objects[pageNumber]
    newObjects[currentHoldIter].x = movePosition.x
    newObjects[currentHoldIter].y = movePosition.y
   
    setTextObjects({...objects,[pageNumber]:newObjects})
  }

  const createTextObject=(pos)=>{
    let value = "sheen"
    let width = pdfContext.measureText(value).width
    let height = 16  
    let objects

    setTextObjects(textObjects=>{
      objects = {...textObjects}
      return textObjects
    })

    let oldObjects = objects[pageNumber]
    if(oldObjects == null){
      oldObjects = []
    }
    let text = new TextObject(value,pos.x,pos.y,width,height,height)
    setTextObjects(objects=>({...objects,[pageNumber]:[...oldObjects,text]}))    
  }

  const displayTextObjects=()=>{
    let canvasImg = pdfCanvasImages[pageNumber]
  
    if(canvasImg == null) return
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height)
    pdfContext.drawImage(canvasImg,0,0,pdfCanvas.width,pdfCanvas.height)

    for(let iter in textObjects[pageNumber]){
      let textObject = textObjects[pageNumber][iter]
      pdfContext.fillText(textObject.value,textObject.x,textObject.y)
    }
  }

  const savePdf=()=>{
    let positionDicts = {}
    for(let pageIter in textObjects){
      let pageObjects = []
      for(let objectIter in textObjects[pageIter]){
        let object = textObjects[pageIter][objectIter]
        pageObjects.push({"position":[object.x,object.y],"value":object.value,
                          "fontSize":object.fontSize})
      }
      positionDicts[pageIter] = pageObjects
    }
    preprocessPdf(props.pdfFile,positionDicts)
  }

  return (
    <div >
        <Navbar fillerCount={props.fillerCount}/>
        <Document
          file={props.pdfFileUrl}
          onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber}
              onRenderSuccess={onPageRenderSuccess}
              onLoadSuccess={onPageLoadSuccess} />
              
        </Document>
        <p onClick={savePdf}>Page {pageNumber} of {numPages}</p>
        <button onClick={nextPage}>Next</button>
        <button onClick={prevPage}>Previous</button>
    </div>
  );
}

export default EditPDF;