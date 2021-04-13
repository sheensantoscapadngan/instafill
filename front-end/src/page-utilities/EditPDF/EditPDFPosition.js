import React,{useContext} from 'react'
import {EditPdfContext} from '../../contexts/EditPdfProvider.js'

export const usePositionHelper=()=>{
    const {canvasBounds,pdfCanvas,canvasOffset} = useContext(EditPdfContext)

    const normalizePosition=(x,y)=>{
        x /= canvasBounds.width
        y /= canvasBounds.height
        x *= pdfCanvas.width
        y *= pdfCanvas.height
        return [x,y]
    }

    const denormalizePosition=(x,y)=>{
        x /= pdfCanvas.width
        y /= pdfCanvas.height
        x *= canvasBounds.width
        y *= canvasBounds.height
        return [x,y]
    }

    const getNormalizedClickPositions=(e)=>{
        let x = e.pageX - canvasOffset.x
        let y = e.pageY - canvasOffset.y
        let normalized = normalizePosition(x,y)
        return [normalized[0],normalized[1]]
    }

    return {normalizePosition, getNormalizedClickPositions,denormalizePosition}

}
