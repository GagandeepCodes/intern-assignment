document.addEventListener("DOMContentLoaded", function() {
    const pdfInput = document.getElementById("pdfInput");
    const pdfContainer = document.getElementById("pdfContainer");
    const zoomInButton = document.getElementById("zoomInButton");
    const zoomOutButton = document.getElementById("zoomOutButton");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    
    let currentScale = 1.0; // Initial scale factor
    let currentPage = 1;   // Current page number
    let pdfDocument = null;
  
    pdfInput.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          const pdfData = event.target.result;
          displayPDF(pdfData);
        };
        
        reader.readAsArrayBuffer(file);
      }
    });
  
    zoomInButton.addEventListener("click", function() {
      changeZoom(0.1);
    });
  
    zoomOutButton.addEventListener("click", function() {
      changeZoom(-0.1);
    });
  
    prevButton.addEventListener("click", function() {
      if (currentPage > 1) {
        currentPage--;
        displayPDFPage(currentPage);
      }
    });
  
    nextButton.addEventListener("click", function() {
      if (currentPage < pdfDocument.numPages) {
        currentPage++;
        displayPDFPage(currentPage);
      }
    });
  
    function displayPDF(pdfData) {
      pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
        pdfDocument = pdf;
        numPages = pdf.numPages;
        displayPDFPage(currentPage);
      });
    }
  
    function displayPDFPage(pageNumber) {
      pdfContainer.innerHTML = ""; // Clear previous content

      pdfDocument.getPage(pageNumber).then(function(page) {
        //It will render the pageNumber PDF page on the canvas
        //And will append the canvas on the pdfContainer.
        const canvas = document.createElement("canvas");
        pdfContainer.appendChild(canvas);
  
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: currentScale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        page.render({
          canvasContext: context,
          viewport: viewport
        });
      });
    }
  
    function changeZoom(delta) {
      //I have set the max scale as 3.0 and the min scale as 0.1
      //Therefore the range of var currentScale is [0.1,3.0].
      currentScale = Math.min(Math.max(currentScale + delta, 0.1), 3.0);
      displayPDFPage(currentPage);
    }
  });
  