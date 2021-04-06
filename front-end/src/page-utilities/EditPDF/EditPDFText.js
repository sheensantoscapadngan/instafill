import React,{useContext} from 'react'
import {EditPdfContext} from '../../contexts/EditPdfProvider.js'
import {TextObject} from '../../pages/EditPDF'
import {usePositionHelper} from './EditPDFPosition'

export const useTextHelper=()=>{
    const {numPages, setNumPages,
        pageNumber, setPageNumber,
        textObjects, setTextObjects,
        pdfContext, setPdfContext,
        selectedTextIter, setSelectedTextIter,
        addTextPosition, setAddTextPosition,
        addedApiResult, setAddedApiResult} = useContext(EditPdfContext)
    
    const {normalizePosition} = usePositionHelper()
    
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

    const checkClickIntersection=(position,holdState,currentHoldIter)=>{

        let localTextObjects
    
        setTextObjects(textObjects=>{
          localTextObjects = {...textObjects}
          return textObjects
        })
    
        let textObjects = localTextObjects[pageNumber]
        let hit = false
        for(let iter in textObjects){
          let text = textObjects[iter]
          hit = (position.x >= text.x && position.x <= text.x + text.width
              && position.y >= text.y - text.height && position.y <= text.y)
          if(hit){
            holdState = true
            currentHoldIter = iter
            setSelectedTextIter(iter)
            return [holdState,currentHoldIter]
          }
        }
        if(!hit){
          setAddTextPosition(position)
          return [holdState, currentHoldIter]
        }
    }

    const moveTextObject=(movePosition,currentHoldIter)=>{
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

    return {createTextObject,checkClickIntersection,moveTextObject,
            editTextObject,onClickSelectedDelete,onClickSelectedIncreaseSize,
            onClickSeletedDecreaseSize,addApiResultToTextObjects}

}


