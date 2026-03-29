const { splitPdf } = require("../src/pdfSplitter");
const { fs } = require("fs");
const { path } = require("path");
const { PDFDocument } = require("pdf-lib");

describe("PDF Splitter Module", () => {
  const testInput = path.join(__dirname, "test_input.pdf");
  const testOutputDir = path.join(__dirname, "test_output");

  beforeAll(async () => {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < 5; i++) {
      pdfDoc.addPage([400, 600]); //Adds a page of 400x600 dimensions
    }
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(testInput, pdfBytes);
  });

  afterAll(async () => {
    //delete all test files
  });

  test("Split a 5 page PDF into chunks of 3 and 2", () => {
    //split files and check
  });

  test("Check if valid PDF", () => {
    //should open and check if number of pages in file matches
  });
});
