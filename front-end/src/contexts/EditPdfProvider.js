import React, {useState, useEffect,  createContext} from "react";

export const EditPdfContext = createContext({editPdfHooks:null})
export default ({children}) => {

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
    const [selectedLineIter, setSelectedLineIter] = useState(null)
  
    const [pdfDims,setPdfDims] = useState([0,0])
    const [selectedTextIter, setSelectedTextIter] = useState(null)
    const [addTextPosition, setAddTextPosition] = useState(null)
    const [editItem, setEditItem] = useState(null)
    const [addedApiResult, setAddedApiResult] = useState([])

    const [holdState, setHoldState] = useState(false)
    const [currentHoldIter, setCurrentHoldIter] = useState(null)

    const editPdfHooks = {numPages, setNumPages,
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
                        addedApiResult, setAddedApiResult,
                        holdState, setHoldState,
                        currentHoldIter, setCurrentHoldIter}

    return (
        <EditPdfContext.Provider value={editPdfHooks}>{children}</EditPdfContext.Provider>
    )

}