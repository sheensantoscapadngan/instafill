import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function downloadPdf(bytes){
  var blob=new Blob([bytes], {type: "application/pdf"});
  var link=document.createElement('a');
  link.href=window.URL.createObjectURL(blob);
  link.download="edited.pdf";
  link.click();
}

async function modifyPdf(bytes,position_dicts) {


  position_dicts = {
      0:[{"position":(10,10),"value":"carabao"}]
  }

  const existingPdfBytes = bytes

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  const pages = pdfDoc.getPages()
  const { width, height } = pages[0]
  console.log("WIDTH AND HEIGHT:",width,",",height)

  for(let page_number in position_dicts){
    let fill_objects = position_dicts[page_number]
    for(let object_number in fill_objects){
      let fill_object = fill_objects[object_number]
      let page = pages[page_number]
      let value = fill_object["value"]
      let position = fill_object["position"]
      page.drawText(value,{
        x:position[0],
        y:position[1],
        size:20
      })
    }
  
  }

  const pdfBytes = await pdfDoc.save()
  downloadPdf(pdfBytes)
}
 
export function preprocessPdf(file,position_dicts){
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = ()=>{
    modifyPdf(reader.result)
  }
} 
  