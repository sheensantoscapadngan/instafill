import React, {useEffect,  createContext} from "react";
import useState from 'react-usestateref'

export const EditPdfContext = createContext({editPdfHooks:null})
export default ({children}) => {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    
    const [textObjects, setTextObjects,textObjectsRef] = useState({})
    const [pdfContext, setPdfContext] = useState(null)
    const [pdfCanvas, setPdfCanvas] = useState(null)
    const [pdfCanvasImages,setPdfCanvasImages] = useState({})
    const [canvasBounds,setCanvasBounds] = useState(null)
    const [canvasOffset, setCanvasOffset] = useState(null)
    const [lineDrawState, setLineDrawState, lineDrawStateRef] = useState(false)
    const [lineDrawObject, setLineDrawObject, lineDrawObjectRef] = useState(null)
    const [lineObjects, setLineObjects, lineObjectsRef] = useState({})
    const [selectedLineIter, setSelectedLineIter, selectedLineIterRef] = useState(null)
  
    const [pdfDims,setPdfDims] = useState([0,0])
    const [selectedTextIter, setSelectedTextIter, selectedTextIterRef] = useState(null)
    const [addTextPosition, setAddTextPosition] = useState(null)
    const [editItem, setEditItem] = useState(null)
    const [addedApiResult, setAddedApiResult] = useState([])

    const [holdState, setHoldState, holdStateRef] = useState(false)
    const [currentHoldIter, setCurrentHoldIter, currentHoldIterRef] = useState(null)

    const [initialLineClickPos, setInitialLineClickPos, initialLineClickPosRef] = useState(null)

    const editPdfHooks = {numPages, setNumPages,
                        pageNumber, setPageNumber,
                        textObjects, setTextObjects, textObjectsRef,
                        pdfContext, setPdfContext,
                        pdfCanvas, setPdfCanvas,
                        pdfCanvasImages, setPdfCanvasImages,
                        canvasBounds, setCanvasBounds,
                        canvasOffset, setCanvasOffset,
                        lineDrawState, setLineDrawState, lineDrawStateRef,
                        lineDrawObject, setLineDrawObject, lineDrawObjectRef,
                        lineObjects, setLineObjects, lineObjectsRef,
                        selectedLineIter, setSelectedLineIter, selectedLineIterRef,
                        pdfDims, setPdfDims,
                        selectedTextIter, setSelectedTextIter, selectedTextIterRef,
                        addTextPosition, setAddTextPosition,
                        editItem, setEditItem,
                        addedApiResult, setAddedApiResult,
                        holdState, setHoldState, holdStateRef,
                        currentHoldIter, setCurrentHoldIter, currentHoldIterRef,
                        initialLineClickPos, setInitialLineClickPos, initialLineClickPosRef}

    return (
        <EditPdfContext.Provider value={editPdfHooks}>{children}</EditPdfContext.Provider>
    )

}