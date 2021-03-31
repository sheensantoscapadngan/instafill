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

async function modifyPdf(bytes,positionDicts) {

  const existingPdfBytes = bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const pages = pdfDoc.getPages()
  const { width, height } = pages[0].getSize()  

  for(let pageNumber in positionDicts){
    let fillObjects = positionDicts[pageNumber]
    for(let objectNumber in fillObjects){
      let fillObject = fillObjects[objectNumber]
      let page = pages[pageNumber-1]
      let value = fillObject["value"]
      let position = fillObject["position"]
      let fontSize = fillObject["fontSize"]

      console.log("WIDTH AND HEIGHT IN PROCESS",width,height)
      position = convertCoordinates(position,[width,height])
      page.drawText(value,{
        x:position[0],
        y:position[1],
        size:fontSize-4
      })
    }
  
  }

  const pdfBytes = await pdfDoc.save()
  downloadPdf(pdfBytes)
}
 
export function preprocessPdf(file,positionDicts){
  console.log("FILE HERE IS",file,"OF TYPE",typeof file)
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = ()=>{
    modifyPdf(reader.result,positionDicts)
  }
} 
  