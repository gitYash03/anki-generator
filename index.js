const path = require("path");
const { splitPdf } = require("./src/pdfSplitter");
const { resolve } = require("dns/promises");

const fileName = process.argv[2];
const pagesPerChunk = process.argv[3];

async function runAnkiPipeline() {
  if (!fileName) {
    console.error("Error please provide PDF filename");
    console.log('Usage: node index.js "YourFileName.pdf" pagesPerChunk');
    process.exit(1);
  }

  const inputPath = path.join(__dirname, "input", fileName); //Build input path

  const tempDir = path.join(__dirname, "temp"); //Temp file to temporarily store PDF chunks

  try {
    console.log(
      `Step 1: Splitting ${fileName} into ${pagesPerChunk} page chunks`,
    );

    const chunkParts = await splitPdf(inputPath, tempDir, pagesPerChunk);
    console.log(
      `Successfully split ${fileName} into ${pagesPerChunk} page chunks`,
    );

    for (let i = 0; i < chunkParts.length; i++) {
      console.log(`Sending chunk ${i} to Gemini API`);

      if (i < chunkParts.length - 1) {
        console.log("Pausing for 15 second to prevent API rate limits");
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
    }

    console.log("--Pipeline Completed");
  } catch (error) {
    console.error("Pileline Failed : ", error.message);
  }
}
