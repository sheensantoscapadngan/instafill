import React,{useContext} from 'react'
import {EditPdfContext} from '../../contexts/EditPdfProvider.js'
import {LineObject} from '../../pages/EditPDF'
import {usePositionHelper} from './EditPDFPosition'

export const useLineHelper=()=>{
    const {pageNumber, setPageNumber,
        lineDrawState, setLineDrawState,
        lineDrawObject, setLineDrawObject,
        lineObjects, setLineObjects,
        selectedLineIter, setSelectedLineIter,
        canvasOffset,
        holdState, setHoldState,
        currentHoldIter, setCurrentHoldIter} = useContext(EditPdfContext)
    
    const {getNormalizedClickPositions} = usePositionHelper()

    const pointDistance=(a,b)=>{
        return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2))
    }
        
    const checkLineIntersection=(position,line)=>{
        let DISTANCE_THRESH = 3.2
        let AC = pointDistance(line.start,position)
        let BC = pointDistance(line.end,position)
        let AB = pointDistance(line.start,line.end)
        return ((AC+BC)-AB < DISTANCE_THRESH)
    }

    const checkLineHit=(position)=>{

        let localLineObjects,hit = false
    
        setLineObjects(lineObjects=>{
          localLineObjects = {...lineObjects}
          return lineObjects
        })
    
        let lineObjects = localLineObjects[pageNumber]
    
        for(let iter in lineObjects){
          let line = lineObjects[iter]
          hit = checkLineIntersection(position,line)
          if(hit){
            setHoldState(true)
            setCurrentHoldIter(iter)
            setSelectedLineIter(iter)
            return true
          }
        }
        return false
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
        let lineHit = checkLineHit(pos)

        if(lineHit){
          //check if click hits a line
          activated = true
        }
        else if(drawState && drawObject == null){
    
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


    const moveLineEnd=(pos)=>{
        let newObject
        setLineDrawObject(lineDrawObject=>{
          newObject = new LineObject(lineDrawObject.start, pos)
          setLineDrawObject(newObject)
        })
    }

    const onClickSelectedLineDelete=()=>{
      let pageObjects = {...lineObjects}
      let objects = [...pageObjects[pageNumber]]
      objects.splice(selectedLineIter,1)
      setSelectedLineIter(null)
      setLineObjects({...pageObjects,[pageNumber]:objects}) 

    }

    const setupPopupLineBox=()=>{

      let popup = null
      if(selectedLineIter != null){
        let selectedItemPosX = lineObjects[pageNumber][selectedLineIter].start[0]
        let selectedItemPosY = lineObjects[pageNumber][selectedLineIter].start[1]    
        let popupBoxStyle = {
          position:'absolute',
          left:canvasOffset.x+selectedItemPosX+'px',
          top:canvasOffset.y+selectedItemPosY+'px'
        }
        popup = <div style={popupBoxStyle}>
                      <button onClick={onClickSelectedLineDelete}>Delete</button>
                  </div>
      }
      return popup
    }

    return {checkLineHit,handleLineState,moveLineEnd,setupPopupLineBox}

}
