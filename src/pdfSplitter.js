//handle cutting pdf
const { fs } = require("fs");
const { path } = reuire("path");
const { PDFDocument } = require("pdf-lib");

/**
 * @param {string} inputPath -Absolute path to input PDF
 * @param {string} outputDir - Absolute path to output temp dir where chunks will be stored
 * @param {number} pagesPerChunk - Pages each chunk should contain (deafault 3)
 * @returns {Promise<string[]>} - An array of paths to newly created chunks
 */

async function splitPdf(inputPath, outputDir, pagesPerChunk = 3) {
  //1. Create temp folder if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdir(outputDir, { recursive: true });
  }

  //2. Load source PDF into memory
  const existingPDFBytes = fs.readFileSync(inputPath); //read file
  const pdfDoc = await PDFDocument.load(existingPDFBytes);

  //3. Determine total number of pages in document
  const totalPages = pdfDoc.getPageCount();
  const chunkPaths = []; //This will be returned

  //4.Loop through the document
  for (let i = 0; i < totalPages; i++) {
    //Create a new PDF file for chunks
    const newChunk = await PDFDocument.create();

    //Array which contains the page numbers of the pages to be included in current chunk
    pageIndices = [];
    PDFEnd = min(i + pagesPerChunk, totalPages);
    for (let j = i; j < PDFEnd; j++) {
      pageIndices.push(j);
    }

    const copiedPages = newChunk.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newChunk.addPage(page));

    //Generate unique chunk name
    const chunkNumber = Math.floor(i / pagesPerChunk) + 1;
    const chunkFileName = `chunk_${chunkNumber}.pdf`;
    const chunkPath = path.join(outputDir, chunkFileName);

    //Save PDF chunk and append chunkPath to return array
    const pdfBytes = await newChunk.save();
    fs.writeFileSync(chunkPath, pdfBytes);
    chunkPaths.push(chunkPath);
  }

  //5. Return paths of each chunk
  return chunkPaths;
}

module.exports = { splitPdf };
