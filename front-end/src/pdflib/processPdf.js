import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function downloadPdf(bytes){
  var blob=new Blob([bytes], {type: "application/pdf"});
  var link=document.createElement('a');
  link.href=window.URL.createObjectURL(blob);
  link.download="edited.pdf";
  link.click();
}

const convertCoordinates=(position,pageDims)=>{
  position[1] = pageDims[1] - position[1]
  return position
}

async function modifyPdf(bytes,textDicts,lineDicts) {

  const existingPdfBytes = bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const pages = pdfDoc.getPages()
  const { width, height } = pages[0].getSize()  

  //add texts 
  for(let pageNumber in textDicts){
    let fillObjects = textDicts[pageNumber]
    for(let objectNumber in fillObjects){
      let fillObject = fillObjects[objectNumber]
      let page = pages[pageNumber-1]
      let value = fillObject["value"]
      let position = fillObject["position"]
      let fontSize = fillObject["fontSize"]

      position = convertCoordinates(position,[width,height])
      page.drawText(value,{
        x:position[0],
        y:position[1],
        size:fontSize-3
      })
    }
  }
  
  //add lines
  for(let pageNumber in lineDicts){
    let fillObjects = lineDicts[pageNumber]
    for(let objectNumber in fillObjects){
      let fillObject = fillObjects[objectNumber]
      let page = pages[pageNumber-1]

      let start = fillObject['start']
      let end = fillObject['end']
      start = convertCoordinates(start,[width,height])
      end = convertCoordinates(end,[width,height])
        
      page.drawLine({
        start:{x:start[0],y:start[1]},
        end:{x:end[0],y:end[1]},
        thickness: 1.2,
        color: rgb(0, 0, 0),
        opacity:0.9
      })

    }
  }

  const pdfBytes = await pdfDoc.save()
  downloadPdf(pdfBytes)
}
 
export function preprocessPdf(file,textDicts,lineDicts){
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = ()=>{
    modifyPdf(reader.result,textDicts,lineDicts)
  }
} 
  