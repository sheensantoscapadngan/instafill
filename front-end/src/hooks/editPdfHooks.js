import React, { useState,useEffect,useRef} from 'react';

export const usePageNumber=()=>{
    const [pageNumber, setPageNumber] = useState(1);
    return [pageNumber,setPageNumber]
}

export const useTextObjects=()=>{
    const [pageNumber, setPageNumber] = useState(1);
    return [pageNumber,setPageNumber]
}

export const usePdfContext=()=>{
    const [pdfContext, setPdfContext] = useState(null)
    return [pdfContext, setPdfContext]
}

export const usePdfCanvas=()=>{
    const [pdfCanvas, setPdfCanvas] = useState(null)
    return [pdfCanvas, setPdfCanvas]
}

export const usePdfCanvasImages=()=>{
    const [pdfCanvasImages, setPdfCanvasImages] = useState({})
    return [pdfCanvasImages, setPdfCanvasImages]
}

export const useCanvasBounds=()=>{
    const [canvasBounds,setCanvasBounds] = useState(null)
    return [canvasBounds,setCanvasBounds]
}

export const useCanvasOffset=()=>{
    const [canvasOffset, setCanvasOffset] = useState(null)
    return [canvasOffset, setCanvasOffset]
}

export const useLineDrawState=()=>{
    const [lineDrawState, setLineDrawState] = useState(false)
    return [lineDrawState, setLineDrawState]
}

export const useLineDrawObject=()=>{
    const [lineDrawObject, setLineDrawObject] = useState(null)
    return [lineDrawObject, setLineDrawObject]
}

export const useLineObjects=()=>{
    const [lineObjects, setLineObjects] = useState({})
    return [lineObjects, setLineObjects]
}

export const useSelectedLineIter=()=>{
    const [selectedLineIter, setSelectedLineIter] = useState(null)
    return [selectedLineIter, setSelectedLineIter]
}

export const usePdfDims=()=>{
    const [pdfDims,setPdfDims] = useState([0,0])
    return [pdfDims,setPdfDims]
}

export const useSelectedTextIter=()=>{
    const [selectedTextIter, setSelectedTextIter] = useState(null)
    return [selectedTextIter, setSelectedTextIter]
}

export const useAddTextPosition=()=>{
    const [addTextPosition, setAddTextPosition] = useState(null)
    return [addTextPosition, setAddTextPosition]
}

export const useEditItem=()=>{
    const [editItem, setEditItem] = useState(null)
    return [editItem, setEditItem]
}

export const useAddedApiResult=()=>{
    const [addedApiResult, setAddedApiResult] = useState([])
    return [addedApiResult, setAddedApiResult]
}