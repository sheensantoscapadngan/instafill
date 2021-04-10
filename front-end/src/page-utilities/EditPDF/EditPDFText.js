import React,{useContext,useRef} from 'react'
import {EditPdfContext} from '../../contexts/EditPdfProvider.js'
import {TextObject} from '../../pages/EditPDF'
import {usePositionHelper} from './EditPDFPosition'

export const useTextHelper=()=>{
    const {numPages, setNumPages,
        pageNumber, setPageNumber,
        textObjects, setTextObjects, textObjectsRef,
        pdfContext, setPdfContext,
        selectedTextIter, setSelectedTextIter,
        addTextPosition, setAddTextPosition,
        addedApiResult, setAddedApiResult,
        editItem, setEditItem,
        canvasOffset, setCanvasOffset,
        holdState, setHoldState,
        currentHoldIter, setCurrentHoldIter} = useContext(EditPdfContext)
    
    const {normalizePosition} = usePositionHelper()

    const addTextRef = useRef(null)
    const editTextRef = useRef(null)

    const createTextObject=(pos,textValue)=>{
        let value = textValue
        let width = pdfContext.measureText(value).width
        let height = 16
        let objects = textObjectsRef.current
        let oldObjects = objects[pageNumber]
        if(oldObjects == null){
          oldObjects = []
        }
        let text = new TextObject(value,pos.x,pos.y,width,height,height)
        setTextObjects({...textObjects,[pageNumber]:[...oldObjects,text]}) 
    }

    const addApiResultToTextObjects=(props)=>{
    
        if(addedApiResult.includes(pageNumber)){
          //results already added to page
          return
        }
      
        if(props.apiResult == null) return
        let instafilled = props.apiResult['instafilled']
        let pageFilled = instafilled[pageNumber]
    
        for(let key in pageFilled){
          let resultObj = pageFilled[key]
          let {value,position} = resultObj

          let normalized = normalizePosition(position[0],position[1])
          let resultPosition = {x:normalized[0],y:normalized[1]}
          if(value != ""){
            createTextObject(resultPosition,value)
          }
        }
        
        setAddedApiResult([...addedApiResult,pageNumber])
    }

    const checkClickIntersection=(position)=>{
        let localTextObjects = textObjectsRef.current
        let textObjects = localTextObjects[pageNumber]
        let hit = false
        for(let iter in textObjects){
          let text = textObjects[iter]
          hit = (position.x >= text.x && position.x <= text.x + text.width
              && position.y >= text.y - text.height && position.y <= text.y)
          if(hit){
            setHoldState(true)
            setCurrentHoldIter(iter)
            setSelectedTextIter(iter)
            return
          }
        }
        if(!hit){
          setAddTextPosition(position)
          return 
        }
    }

    const moveTextObject=(movePosition,currentHoldIter)=>{
        let objects = textObjectsRef.current
        let newObjects = objects[pageNumber]
        newObjects[currentHoldIter].x = movePosition.x
        newObjects[currentHoldIter].y = movePosition.y
        setTextObjects({...objects,[pageNumber]:newObjects})
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
        objects.splice(selectedTextIter,1)
        setSelectedTextIter(null)
        setTextObjects({...pageObjects,[pageNumber]:objects}) 
    }
    
    const onClickSelectedIncreaseSize=()=>{
        let pageObjects = {...textObjects}
        let objects = [...pageObjects[pageNumber]]
        let currentSize = objects[selectedTextIter].fontSize
        objects[selectedTextIter].fontSize = currentSize+1
        setTextObjects({...pageObjects,[pageNumber]:objects}) 
    }
    
    const onClickSeletedDecreaseSize=()=>{
        let pageObjects = {...textObjects}
        let objects = [...pageObjects[pageNumber]]
        let currentSize = objects[selectedTextIter].fontSize
        if(currentSize > 5){
          objects[selectedTextIter].fontSize = currentSize-1
          setTextObjects({...pageObjects,[pageNumber]:objects}) 
        }
    }

    const onClickEdit=()=>setEditItem(selectedTextIter)
   
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

    const setupSelectedTextPopup=()=>{
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

    return {createTextObject,checkClickIntersection,moveTextObject,
            editTextObject,onClickSelectedDelete,onClickSelectedIncreaseSize,
            onClickSeletedDecreaseSize,addApiResultToTextObjects,setupAddTextPopup,addTextTrigger,
            setupSelectedTextPopup,setupEditTextPopup}

}


