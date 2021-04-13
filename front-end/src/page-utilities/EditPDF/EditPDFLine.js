import React,{useContext} from 'react'
import {EditPdfContext} from '../../contexts/EditPdfProvider.js'
import {LineObject} from '../../pages/EditPDF'
import {usePositionHelper} from './EditPDFPosition'

export const useLineHelper=()=>{
    const {pageNumber, setPageNumber,
        lineDrawState, setLineDrawState, lineDrawStateRef,
        lineDrawObject, setLineDrawObject, lineDrawObjectRef,
        lineObjects, setLineObjects, lineObjectsRef,
        selectedLineIter, setSelectedLineIter,
        canvasOffset,
        holdState, setHoldState,
        currentHoldIter, setCurrentHoldIter,
        initialLineClickPos, setInitialLineClickPos, initialLineClickPosRef} = useContext(EditPdfContext)
    
    const {getNormalizedClickPositions,denormalizePosition} = usePositionHelper()

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
        let hit = false
        let localLineObjects = lineObjectsRef.current
        let lineObjects = localLineObjects[pageNumber]
        for(let iter in lineObjects){
          let line = lineObjects[iter]
          hit = checkLineIntersection(position,line)
          if(hit){
            setInitialLineClickPos(position)
            setHoldState(true)
            setCurrentHoldIter(iter)
            setSelectedLineIter(iter)
            return true
          }
        }
        return false
    }

    const handleLineState=(e)=>{
        let activated = false
        let pos = getNormalizedClickPositions(e)
        let lineHit = checkLineHit(pos)

        if(lineHit){
          //check if click hits a line
          activated = true
        }
        
        else if(lineDrawStateRef.current && lineDrawObjectRef.current == null){
          activated = true
          setLineDrawObject(new LineObject(pos,pos))
        }
        else if(lineDrawStateRef.current && lineDrawObjectRef.current != null){
          lineDrawObjectRef.current.end = pos
          activated = true
          let objects = lineObjectsRef.current[pageNumber] || []
          let newLineObjects = [...objects,lineDrawObjectRef.current]
          setLineObjects({...lineObjects,[pageNumber]:newLineObjects})
          setLineDrawObject(null)
        }

        return activated
    }

    const moveLineEnd=(pos)=>{
        let newObject
        newObject = new LineObject(lineDrawObjectRef.current.start, pos)
        setLineDrawObject(newObject)
    }

    const calculateLineMoveOffset=(movePosition)=>{
      let initialLineClickPos = initialLineClickPosRef.current
      let moveOffset = {x:movePosition.x-initialLineClickPos[0],y:movePosition.y-initialLineClickPos[1]}
      setInitialLineClickPos([movePosition.x, movePosition.y])
      return moveOffset
    }

    const moveLineObject=(movePosition,holdIter,objects)=>{
      let moveOffset = calculateLineMoveOffset(movePosition)
      let newObjects = [...objects[pageNumber]]
      let object = newObjects[holdIter]

      if(isNaN(object.start[0])) return
      newObjects[holdIter].start = [object.start[0]+moveOffset.x,object.start[1]+moveOffset.y]
      newObjects[holdIter].end = [object.end[0]+moveOffset.x,object.end[1]+moveOffset.y]

      let newLineObjects = {...objects,[pageNumber]:newObjects}
      setLineObjects(newLineObjects)
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
        let denormalized = denormalizePosition(selectedItemPosX,selectedItemPosY)
        let popupBoxStyle = {
          position:'absolute',
          left:canvasOffset.x+denormalized[0]+'px',
          top:canvasOffset.y+denormalized[1]+'px'
        }
        popup = <div style={popupBoxStyle}>
                      <button onClick={onClickSelectedLineDelete}>Delete</button>
                  </div>
      }
      return popup
    }

    return {checkLineHit,handleLineState,moveLineEnd,setupPopupLineBox,
            moveLineObject}

}
