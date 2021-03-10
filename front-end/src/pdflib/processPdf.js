import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function downloadPdf(bytes){
  var blob=new Blob([bytes], {type: "application/pdf"});// change resultByte to bytes
  var link=document.createElement('a');
  link.href=window.URL.createObjectURL(blob);
  link.download="edited.pdf";
  link.click();
}

async function modifyPdf(bytes) {

  const existingPdfBytes = bytes

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText('This text was added with JavaScript!', {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  })

  const pdfBytes = await pdfDoc.save()
  downloadPdf(pdfBytes)
}
 
export function preprocessPdf(file){
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = ()=>{
    modifyPdf(reader.result)
  }
}
