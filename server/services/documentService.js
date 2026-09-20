const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const extractTextFromFile = async (filePath, mimeType) => {
    const absolutePath = path.resolve(filePath);

    // PDF
    if (mimeType === "application/pdf") {
    const buffer = fs.readFileSync(absolutePath);

    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
}

    // DOCX
    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const result = await mammoth.extractRawText({
            path: absolutePath,
        });

        return result.value;
    }

    // TXT
    if (mimeType === "text/plain") {
        return fs.readFileSync(absolutePath, "utf8");
    }

    throw new Error(
        "Unsupported file type. Only PDF, DOCX and TXT files are allowed."
    );
};


// Split extracted text into chunks
const splitTextIntoChunks = (text, chunkSize = 1000) => {
    const cleanText = text
        .replace(/\s+/g, " ")
        .trim();

    if (!cleanText) {
        return [];
    }

    const chunks = [];

    for (let i = 0; i < cleanText.length; i += chunkSize) {
        chunks.push(cleanText.substring(i, i + chunkSize));
    }

    return chunks;
};


module.exports = {
    extractTextFromFile,
    splitTextIntoChunks,
};