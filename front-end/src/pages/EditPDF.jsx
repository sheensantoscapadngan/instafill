import {Button, Navbar} from '../components/common';
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

class LineObject{
  constructor(start,end){
    this.start = start
    this.end = end
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
  const [canvasOffset, setCanvasOffset] = useState(null)
  const [lineDrawState, setLineDrawState] = useState(false)
  const [lineDrawObject, setLineDrawObject] = useState(null)
  const [lineObjects, setLineObjects] = useState({})
  const [currentLineItem, setCurrentLineItem] = useState(null)

  const [pdfDims,setPdfDims] = useState([0,0])
  const [selectedItem, setSelectedItem] = useState(null)
  const [addTextPosition, setAddTextPosition] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [addedApiResult, setAddedApiResult] = useState([])

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
      addApiResultToTextObjects()
    }
  },[pdfContext,canvasBounds])

  useEffect(()=>{
    if(selectedItem != null){
      setAddTextPosition(null)
      setEditItem(null)
    }
  },[selectedItem])

  useEffect(()=>{
    if(editItem != null){
      setSelectedItem(null)
      setAddTextPosition(null)
    }
  },[editItem])

  useEffect(()=>{
    if(addTextPosition != null){
      setEditItem(null)
      setSelectedItem(null)
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

  const addApiResultToTextObjects=()=>{
    
    if(addedApiResult.includes(pageNumber)){
      //results already added to page
      return
    }

    if(props.apiResult == null) return
    let instafilled = props.apiResult['instafilled']
    let pageFilled = instafilled[pageNumber]

    for(let key in pageFilled){
      let resultObj = pageFilled[key]
      let resultValue = resultObj.value
      let resultCoord = resultObj.position[0]
      let normalized = normalizePosition(resultCoord[0],resultCoord[1])
      let resultPosition = {x:normalized[0],y:normalized[1]}
      if(resultValue != ""){
        createTextObject(resultPosition,resultValue)
      }
    }

    setAddedApiResult([...addedApiResult,pageNumber])
    
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
      setSelectedItem(null)
      setEditItem(null)
      setAddTextPosition(null)
    
  }
  
  const prevPage=()=>{
    if(pageNumber-1 > 0)
      setPageNumber(pageNumber-1)
      setSelectedItem(null)
      setEditItem(null)
      setAddTextPosition(null)
    
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
        setSelectedItem(iter)
        break
      }
    }
    if(!hit){
      setAddTextPosition(position)
    }
  }

  const normalizePosition=(x,y)=>{
    x /= canvasBounds.width
    y /= canvasBounds.height
    x *= pdfCanvas.width
    y *= pdfCanvas.height
    return [x,y]
  }

  const getNormalizedClickPositions=(e)=>{
    let x = e.pageX - canvasOffset.x
    let y = e.pageY - canvasOffset.y
    let normalized = normalizePosition(x,y)
    return [normalized[0],normalized[1]]
  }

  const handleLineState=(e)=>{
    let drawState = false
    let drawObject = null
    let activated = false

    setLineDrawState(lineDrawState=>{
      drawState = lineDrawState
      return lineDrawState
    })

    setLineDrawObject(lineDrawObject=>{
      drawObject = lineDrawObject
      return lineDrawObject
    })

    let pos = getNormalizedClickPositions(e)

    if(drawState && drawObject == null){

      activated = true
      setLineDrawObject(new LineObject(pos,pos))

    }else if(drawState && drawObject != null){

      drawObject.end = pos
      activated = true
      let objects = []

      setLineObjects(lineObjects=>{ 
        if(pageNumber in lineObjects){
          objects = lineObjects[pageNumber]
        }
        let newLineObjects = [...objects,drawObject]
        return {...lineObjects,[pageNumber]:newLineObjects}
      })

      setLineDrawObject(null)
    }

    return activated
  }

  const handleMouseDown=(e)=>{
    e.preventDefault()

    if(handleLineState(e)){


    }

    else if(e.button == 0){
      let pos = getNormalizedClickPositions(e)
      startPosition = {x:pos[0],y:pos[1]}
      checkClickIntersection(startPosition)
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

  const moveLineEnd=(pos)=>{
    let newObject
    setLineDrawObject(lineDrawObject=>{
      newObject = new LineObject(lineDrawObject.start, pos)
      setLineDrawObject(newObject)
    })

  }

  const createTextObject=(pos,textValue)=>{
    let value = textValue
    let width = pdfContext.measureText(value).width
    let height = 16
    let objects

    setTextObjects(textObjects=>{
      objects = {...textObjects}
      let oldObjects = objects[pageNumber]
      if(oldObjects == null){
        oldObjects = []
      }
      let text = new TextObject(value,pos.x,pos.y,width,height,height)
      return {...textObjects,[pageNumber]:[...oldObjects,text]}
    })

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

  const editTextObject=(item,newValue)=>{
    let pageObjects = {...textObjects}
    let objects = [...pageObjects[pageNumber]]
    objects[item].value = newValue
    objects[item].width = pdfContext.measureText(newValue).width
    setTextObjects({...pageObjects,[pageNumber]:objects})
  }

  const onClickSelectedDelete=()=>{
    let pageObjects = {...textObjects}
    let objects = [...pageObjects[pageNumber]]
    objects.splice(selectedItem,1)
    setSelectedItem(null)
    setTextObjects({...pageObjects,[pageNumber]:objects}) 
  }

  const onClickSelectedIncreaseSize=()=>{
    let pageObjects = {...textObjects}
    let objects = [...pageObjects[pageNumber]]
    let currentSize = objects[selectedItem].fontSize
    objects[selectedItem].fontSize = currentSize+1
    setTextObjects({...pageObjects,[pageNumber]:objects}) 
  }

  const onClickSeletedDecreaseSize=()=>{
    let pageObjects = {...textObjects}
    let objects = [...pageObjects[pageNumber]]
    let currentSize = objects[selectedItem].fontSize
    if(currentSize > 5){
      objects[selectedItem].fontSize = currentSize-1
      setTextObjects({...pageObjects,[pageNumber]:objects}) 
    }
  }

  const onClickEdit=()=>{
    setEditItem(selectedItem)
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
      setLineDrawState(!lineDrawState)
  }

  const setupSelectedPopup=()=>{
    let popup = null
    if(selectedItem != null){

      let selectedItemPosX = textObjects[pageNumber][selectedItem].x
      let selectedItemPosY = textObjects[pageNumber][selectedItem].y
  
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
    <div >
        <Navbar fillerCount={props.fillerCount}/>
        <Document
          file={props.pdfFileUrl}
          onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber}
              onRenderSuccess={onPageRenderSuccess}
              onLoadSuccess={onPageLoadSuccess}/>
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        <button onClick={nextPage}>Next</button>
        <button onClick={prevPage}>Previous</button>
        <button onClick={savePdf}>Download</button>
        <button onClick={activateLineDraw}>Line</button>
        {popupBox}
        {popupAddText}
        {popupEdit}
    </div>
  );
}

export default EditPDF; 