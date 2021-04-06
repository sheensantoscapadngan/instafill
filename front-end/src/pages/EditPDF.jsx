import {Button, Navbar} from '../components/common';
import React, { useState,useEffect,useRef,useContext} from 'react';
import {preprocessPdf} from '../pdflib/processPdf.js'
import {EditPdfContext} from '../contexts/EditPdfProvider.js'
import {useTextHelper} from '../page-utilities/EditPDF/EditPDFText.js'
import {usePositionHelper} from '../page-utilities/EditPDF/EditPDFPosition.js'
import {useLineHelper} from '../page-utilities/EditPDF/EditPDFLine.js'

import './EditPDF.css';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export class TextObject{
  constructor(value,x,y,width,height,fontSize){
    this.value = value
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fontSize = fontSize
  }
}

export class LineObject{
  constructor(start,end){
    this.start = start
    this.end = end
  }
}

const EditPDF = (props) => {

  const {numPages, setNumPages,
    pageNumber, setPageNumber,
    textObjects, setTextObjects,
    pdfContext, setPdfContext,
    pdfCanvas, setPdfCanvas,
    pdfCanvasImages, setPdfCanvasImages,
    canvasBounds, setCanvasBounds,
    canvasOffset, setCanvasOffset,
    lineDrawState, setLineDrawState,
    lineDrawObject, setLineDrawObject,
    lineObjects, setLineObjects,
    selectedLineIter, setSelectedLineIter,
    pdfDims, setPdfDims,
    selectedTextIter, setSelectedTextIter,
    addTextPosition, setAddTextPosition,
    editItem, setEditItem,
    addedApiResult, setAddedApiResult} = useContext(EditPdfContext)

  
  const {createTextObject,checkClickIntersection,moveTextObject,
    editTextObject,onClickSelectedDelete,onClickSelectedIncreaseSize,
    onClickSeletedDecreaseSize,addApiResultToTextObjects} = useTextHelper()
  const {getNormalizedClickPositions} = usePositionHelper()
  const {handleLineState,moveLineEnd} = useLineHelper()

  const addTextRef = useRef(null)
  const editTextRef = useRef(null)

  let startPosition = {x:0,y:0}
  let holdState = false
  let currentHoldIter = null

  useEffect(()=>{
    if(pdfCanvas != null){
      attachMouseListeners()
    }
  },[canvasBounds])

  useEffect(()=>{
    if(pdfCanvas != null && canvasBounds != null){
      displayObjects()
    }
  },[textObjects,lineObjects,pdfCanvas,lineDrawObject])

  useEffect(()=>{
    if(pdfCanvas != null){  
      let canvasImg = pdfCanvasImages[pageNumber]
      if(canvasImg == null) return

      if(canvasOffset == null){
        let bounds = pdfCanvas.getBoundingClientRect()
        let offset = {x:bounds.left,y:bounds.top}
        setCanvasOffset(offset) 
        setCanvasBounds(bounds)  
      }else{
        attachMouseListeners()
      }
    }
  },[pdfCanvas,pdfDims])

  useEffect(()=>{
    if(pdfContext != null && canvasBounds != null){
      addApiResultToTextObjects(props)
    }
  },[pdfContext,canvasBounds])

  useEffect(()=>{
    if(selectedTextIter != null){
      setAddTextPosition(null)
      setEditItem(null)
    }
  },[selectedTextIter])

  useEffect(()=>{
    if(editItem != null){
      setSelectedTextIter(null)
      setAddTextPosition(null)
    }
  },[editItem])

  useEffect(()=>{
    if(addTextPosition != null){
      setEditItem(null)
      setSelectedTextIter(null)
    }
  },[addTextPosition])

  const onDocumentLoadSuccess=({ numPages })=>{
    setNumPages(numPages);
  } 

  const onPageRenderSuccess=()=>{

    let canvas = document.querySelector('.react-pdf__Page__canvas');
    let context = canvas.getContext("2d")
  
    console.log("PAGE RENDERED!")
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

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
      textLayers.forEach(layer => {
        const { style } = layer;
        style.top = "-1000px";
        style.left = "-1000px";
        style.transform = "";
    });
  }

  const onPageLoadSuccess=({width,height})=>{
      removeTextLayerOffset()
      setPdfDims([width,height])
  }

  const nextPage=()=>{
    if(pageNumber+1 <= numPages)
      setPageNumber(pageNumber+1)
      setSelectedTextIter(null)
      setEditItem(null)
      setAddTextPosition(null)
    
  }
  
  const prevPage=()=>{
    if(pageNumber-1 > 0)
      setPageNumber(pageNumber-1)
      setSelectedTextIter(null)
      setEditItem(null)
      setAddTextPosition(null)
    
  } 

  const handleMouseDown=(e)=>{
    e.preventDefault()

    let lineState = handleLineState(e,holdState,currentHoldIter)
    holdState = lineState[1]
    currentHoldIter = lineState[2]

    console.log("LINE STATE IS",lineState)

    if(lineState[0]){
      //trigger when add line option is activated
    }
    else if(e.button == 0){
      let pos = getNormalizedClickPositions(e)
      startPosition = {x:pos[0],y:pos[1]}
      let clickIntersection = checkClickIntersection(startPosition,holdState,currentHoldIter)
      holdState = clickIntersection[0]
      currentHoldIter = clickIntersection[1]

    }
  }

  const handleMouseMove=(e)=>{
    e.preventDefault()
    let pos = getNormalizedClickPositions(e)
    let lineDrawObject = null
    let lineDrawState = false

    setLineDrawObject(object=>{
      lineDrawObject = object
      return object
    })

    setLineDrawState(state=>{
      lineDrawState = state
      return state
    })
    
    if(lineDrawState && lineDrawObject != null){
      moveLineEnd(pos)
    }
    else if(holdState){
      let movePosition = {x:pos[0],y:pos[1]}
      moveTextObject(movePosition,currentHoldIter)
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

  const displayLine=(lineObject)=>{
    pdfContext.beginPath()
    pdfContext.moveTo(lineObject.start[0], lineObject.start[1])
    pdfContext.lineTo(lineObject.end[0], lineObject.end[1])
    pdfContext.stroke()
  }

  const displayObjects=()=>{
    let canvasImg = pdfCanvasImages[pageNumber]
  
    if(canvasImg == null) return
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height)
    pdfContext.drawImage(canvasImg,0,0,pdfCanvas.width,pdfCanvas.height)

    if(lineDrawObject != null){
      displayLine(lineDrawObject)
    } 

    //---------DISPLAY TEXT OBJECTS------------//
    for(let iter in textObjects[pageNumber]){
      let textObject = textObjects[pageNumber][iter]
      let fontSize = textObject.fontSize
      let defaultFont = "16px verdana"
      let font = fontSize+"px verdana"
      pdfContext.font = font
      //pdfContext.font = fontSize+"px" + "verdana"
      pdfContext.fillText(textObject.value,textObject.x,textObject.y)
      pdfContext.font = defaultFont
    }

    //---------DISPLAY LINE OBJECTS------------//
    for(let iter in lineObjects[pageNumber]){
      let lineObject = lineObjects[pageNumber][iter]
      displayLine(lineObject)
    }

  }

  const normalizeForPdfSave=(pos)=>{
    let normalizedPosition = [pos[0]/pdfCanvas.width,pos[1]/pdfCanvas.height]
    let scaledPosition = [normalizedPosition[0]*pdfDims[0],normalizedPosition[1]*pdfDims[1]]
    return scaledPosition
  }
  
  const savePdf=()=>{

    //save text
    let textDicts = {}
    for(let pageIter in textObjects){
      let pageObjects = []
      for(let objectIter in textObjects[pageIter]){
        let object = textObjects[pageIter][objectIter]
        let scaledPosition = normalizeForPdfSave([object.x,object.y])
        pageObjects.push({"position":scaledPosition,"value":object.value,
                          "fontSize":object.fontSize})
      }
      textDicts[pageIter] = pageObjects
    }

    //save lines
    let lineDicts = {}
    for(let pageIter in lineObjects){
      let pageObjects = []
      for(let objectIter in lineObjects[pageIter]){
        let object = lineObjects[pageIter][objectIter]
        let scaledStartPosition = normalizeForPdfSave(object.start)
        let scaledEndPosition = normalizeForPdfSave(object.end)
        pageObjects.push({"start":scaledStartPosition,"end":scaledEndPosition})
      }
      lineDicts[pageIter] = pageObjects
    }

    preprocessPdf(props.pdfFile,textDicts,lineDicts)
  }



  const onClickEdit=()=>{
    setEditItem(selectedTextIter)
  }

  const addTextTrigger=(e)=>{
    if(e.key == 'Enter'){
      createTextObject(addTextPosition,addTextRef.current.value)
      setAddTextPosition(null)
    }
  }

  const editTextTrigger=(e)=>{
    if(e.key == 'Enter'){
      editTextObject(editItem,editTextRef.current.value)
      setEditItem(null)
    }
  }

  const activateLineDraw=()=>{
      console.log("LINE DRAW STATE ACTIVATED!")
      setLineDrawState(!lineDrawState)
  }

  const setupSelectedPopup=()=>{
    let popup = null
    if(selectedTextIter != null){

      let selectedItemPosX = textObjects[pageNumber][selectedTextIter].x
      let selectedItemPosY = textObjects[pageNumber][selectedTextIter].y
  
      let popupBoxStyle = {
        position:'absolute',
        left:canvasOffset.x+selectedItemPosX+'px',
        top:canvasOffset.y+selectedItemPosY+'px'
      }
      popup = <div style={popupBoxStyle}>
                    <button onClick={onClickEdit}>Edit</button>
                    <button onClick={onClickSelectedDelete}>Delete</button>
                    <button onClick={onClickSeletedDecreaseSize}>Decrease</button>
                    <button onClick={onClickSelectedIncreaseSize}>Increase</button>
                </div>
    }
    return popup
  }

  const setupAddTextPopup=()=>{
    let popup = null
    if(addTextPosition != null){
      let positionX = addTextPosition.x
      let positionY = addTextPosition.y
      let popupStyle = {
        position:'absolute',
        left: positionX,
        top: positionY
      }
      popup = <input ref={addTextRef} type="text" placeholder="Enter Text" style={popupStyle} onKeyDown={addTextTrigger}></input>
    }
    return popup
  }

  const setupEditTextPopup=()=>{
    let popup = null
    if(editItem != null){
      let positionX = textObjects[pageNumber][editItem].x
      let positionY = textObjects[pageNumber][editItem].y
      let oldValue = textObjects[pageNumber][editItem].value
  
      let popupStyle = {
        position:'absolute',
        left:canvasOffset.x+positionX+'px',
        top:canvasOffset.y+positionY+'px'
      }
      popup = <input ref={editTextRef} type="text" placeholder="Enter Text"
                  style={popupStyle} onKeyDown={editTextTrigger} defaultValue={oldValue}></input>

    }
    return popup
  }

  let popupBox = setupSelectedPopup()
  let popupAddText = setupAddTextPopup()
  let popupEdit = setupEditTextPopup()

  return (
    <div className="body" >
        <Navbar fillerCount={props.fillerCount}/>
        <div >
        <Document
          file={props.pdfFileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="document">
            <Page pageNumber={pageNumber}
              onRenderSuccess={onPageRenderSuccess}
              onLoadSuccess={onPageLoadSuccess}/>
        </Document>
        </div>
        <div className="button">
          <p>Page {pageNumber} of {numPages}</p>
        
          <Button 
          type="button"
          buttonStyle="btn--danger--solid"
          buttonSize="btn--small" 
          onClick={nextPage}> Next</Button>
          <Button 
          type="button"
          buttonStyle="btn--danger--solid"
          buttonSize="btn--small" 
          onClick={prevPage}>Previous</Button>
          <Button 
          type="button"
          buttonStyle="btn--danger--solid"
          buttonSize="btn--small" 
          onClick={savePdf}>Download</Button>
          <Button 
          type="button"
          buttonStyle="btn--danger--solid"
          buttonSize="btn--small"
          onClick={activateLineDraw}>Line</Button>
          {popupBox}
          {popupAddText}
          {popupEdit}
        </div>
    </div>
  );
}

export default EditPDF; 