const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

class FileConverterEngine {
    constructor() {
        this.supportedConversions = {
            // Image conversions
            'png': ['jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'pdf'],
            'jpg': ['png', 'webp', 'gif', 'bmp', 'tiff', 'pdf'],
            'jpeg': ['png', 'webp', 'gif', 'bmp', 'tiff', 'pdf'],
            'webp': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'pdf'],
            'gif': ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'pdf'],
            'bmp': ['png', 'jpg', 'jpeg', 'webp', 'gif', 'tiff', 'pdf'],
            'tiff': ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'pdf'],
            
            // Document conversions
            'txt': ['pdf', 'html', 'docx'],
            'html': ['pdf', 'txt'],
            'docx': ['pdf', 'txt', 'html'],
            'pdf': ['txt', 'html'],
            
            // Spreadsheet conversions
            'xlsx': ['csv', 'pdf', 'html'],
            'csv': ['xlsx', 'pdf', 'html']
        };
    }

    async convertFile(inputPath, outputPath, outputFormat, options = {}) {
        const inputExtension = path.extname(inputPath).toLowerCase().substring(1);
        const outputExtension = outputFormat.toLowerCase();

        if (!this.isConversionSupported(inputExtension, outputExtension)) {
            throw new Error(`Conversion from ${inputExtension} to ${outputExtension} is not supported`);
        }

        try {
            switch (this.getFileCategory(inputExtension)) {
                case 'image':
                    return await this.convertImage(inputPath, outputPath, outputExtension, options);
                case 'document':
                    return await this.convertDocument(inputPath, outputPath, outputExtension, options);
                case 'spreadsheet':
                    return await this.convertSpreadsheet(inputPath, outputPath, outputExtension, options);
                default:
                    throw new Error(`Unsupported file category for ${inputExtension}`);
            }
        } catch (error) {
            throw new Error(`Conversion failed: ${error.message}`);
        }
    }

    isConversionSupported(inputFormat, outputFormat) {
        return this.supportedConversions[inputFormat] && 
               this.supportedConversions[inputFormat].includes(outputFormat);
    }

    getFileCategory(extension) {
        const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'];
        const documentFormats = ['txt', 'html', 'docx', 'pdf'];
        const spreadsheetFormats = ['xlsx', 'csv'];

        if (imageFormats.includes(extension)) return 'image';
        if (documentFormats.includes(extension)) return 'document';
        if (spreadsheetFormats.includes(extension)) return 'spreadsheet';
        return 'unknown';
    }

    async convertImage(inputPath, outputPath, outputFormat, options = {}) {
        const quality = options.quality || 90;
        const width = options.width;
        const height = options.height;

        let sharpInstance = sharp(inputPath);

        // Resize if dimensions provided
        if (width || height) {
            sharpInstance = sharpInstance.resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Convert based on output format
        switch (outputFormat) {
            case 'jpg':
            case 'jpeg':
                await sharpInstance
                    .jpeg({ quality: parseInt(quality) })
                    .toFile(outputPath);
                break;
            case 'png':
                await sharpInstance
                    .png({ quality: parseInt(quality) })
                    .toFile(outputPath);
                break;
            case 'webp':
                await sharpInstance
                    .webp({ quality: parseInt(quality) })
                    .toFile(outputPath);
                break;
            case 'gif':
                await sharpInstance
                    .gif()
                    .toFile(outputPath);
                break;
            case 'bmp':
                await sharpInstance
                    .bmp()
                    .toFile(outputPath);
                break;
            case 'tiff':
                await sharpInstance
                    .tiff({ quality: parseInt(quality) })
                    .toFile(outputPath);
                break;
            case 'pdf':
                // Convert image to PDF
                await this.imageToPdf(inputPath, outputPath);
                break;
            default:
                throw new Error(`Unsupported image output format: ${outputFormat}`);
        }

        return { success: true, outputPath };
    }

    async imageToPdf(imagePath, outputPath) {
        const pdfDoc = await PDFDocument.create();
        const imageBytes = fs.readFileSync(imagePath);
        
        let image;
        const ext = path.extname(imagePath).toLowerCase();
        
        if (ext === '.png') {
            image = await pdfDoc.embedPng(imageBytes);
        } else if (ext === '.jpg' || ext === '.jpeg') {
            image = await pdfDoc.embedJpg(imageBytes);
        } else {
            // Convert to PNG first using Sharp, then embed
            const pngBuffer = await sharp(imagePath).png().toBuffer();
            image = await pdfDoc.embedPng(pngBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
    }

    async convertDocument(inputPath, outputPath, outputFormat, options = {}) {
        const inputExtension = path.extname(inputPath).toLowerCase().substring(1);

        switch (inputExtension) {
            case 'txt':
                return await this.convertFromText(inputPath, outputPath, outputFormat);
            case 'html':
                return await this.convertFromHtml(inputPath, outputPath, outputFormat);
            case 'docx':
                return await this.convertFromDocx(inputPath, outputPath, outputFormat);
            case 'pdf':
                return await this.convertFromPdf(inputPath, outputPath, outputFormat);
            default:
                throw new Error(`Unsupported document input format: ${inputExtension}`);
        }
    }

    async convertFromText(inputPath, outputPath, outputFormat) {
        const textContent = fs.readFileSync(inputPath, 'utf8');

        switch (outputFormat) {
            case 'html':
                const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
    </style>
</head>
<body>
    <h1>Converted Text Document</h1>
    <pre>${this.escapeHtml(textContent)}</pre>
</body>
</html>`;
                fs.writeFileSync(outputPath, htmlContent, 'utf8');
                break;

            case 'pdf':
                await this.textToPdf(textContent, outputPath);
                break;

            case 'docx':
                throw new Error('Text to DOCX conversion requires additional libraries');

            default:
                throw new Error(`Unsupported output format for text: ${outputFormat}`);
        }

        return { success: true, outputPath };
    }

    async textToPdf(textContent, outputPath) {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        const fontSize = 12;
        const margin = 50;
        const lineHeight = fontSize * 1.2;
        const maxWidth = width - (margin * 2);
        
        // Split text into lines that fit the page width
        const lines = this.wrapText(textContent, maxWidth, fontSize);
        
        let yPosition = height - margin;
        let currentPage = page;
        
        for (const line of lines) {
            if (yPosition < margin + lineHeight) {
                // Create new page
                currentPage = pdfDoc.addPage();
                yPosition = height - margin;
            }
            
            currentPage.drawText(line, {
                x: margin,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
            
            yPosition -= lineHeight;
        }

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
    }

    wrapText(text, maxWidth, fontSize) {
        // Simple text wrapping - in a real implementation, you'd use proper text measurement
        const lines = text.split('\n');
        const wrappedLines = [];
        const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6)); // Approximate

        for (const line of lines) {
            if (line.length <= charsPerLine) {
                wrappedLines.push(line);
            } else {
                let currentLine = '';
                const words = line.split(' ');
                
                for (const word of words) {
                    if ((currentLine + word).length <= charsPerLine) {
                        currentLine += (currentLine ? ' ' : '') + word;
                    } else {
                        if (currentLine) {
                            wrappedLines.push(currentLine);
                        }
                        currentLine = word;
                    }
                }
                
                if (currentLine) {
                    wrappedLines.push(currentLine);
                }
            }
        }

        return wrappedLines;
    }

    async convertFromHtml(inputPath, outputPath, outputFormat) {
        const htmlContent = fs.readFileSync(inputPath, 'utf8');

        switch (outputFormat) {
            case 'txt':
                // Simple HTML to text conversion (removes tags)
                const textContent = htmlContent
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/\s+/g, ' ')
                    .trim();
                
                fs.writeFileSync(outputPath, textContent, 'utf8');
                break;

            case 'pdf':
                // HTML to PDF conversion would require puppeteer or similar
                throw new Error('HTML to PDF conversion requires Puppeteer library');

            default:
                throw new Error(`Unsupported output format for HTML: ${outputFormat}`);
        }

        return { success: true, outputPath };
    }

    async convertFromDocx(inputPath, outputPath, outputFormat) {
        switch (outputFormat) {
            case 'txt':
                const result = await mammoth.extractRawText({ path: inputPath });
                fs.writeFileSync(outputPath, result.value, 'utf8');
                break;

            case 'html':
                const htmlResult = await mammoth.convertToHtml({ path: inputPath });
                const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
    </style>
</head>
<body>
    ${htmlResult.value}
</body>
</html>`;
                fs.writeFileSync(outputPath, fullHtml, 'utf8');
                break;

            case 'pdf':
                // Convert DOCX to text first, then to PDF
                const textResult = await mammoth.extractRawText({ path: inputPath });
                await this.textToPdf(textResult.value, outputPath);
                break;

            default:
                throw new Error(`Unsupported output format for DOCX: ${outputFormat}`);
        }

        return { success: true, outputPath };
    }

    async convertFromPdf(inputPath, outputPath, outputFormat) {
        // PDF conversion would require pdf-parse or similar libraries
        throw new Error('PDF input conversion requires additional libraries like pdf-parse');
    }

    async convertSpreadsheet(inputPath, outputPath, outputFormat, options = {}) {
        const inputExtension = path.extname(inputPath).toLowerCase().substring(1);

        switch (inputExtension) {
            case 'xlsx':
                return await this.convertFromXlsx(inputPath, outputPath, outputFormat);
            case 'csv':
                return await this.convertFromCsv(inputPath, outputPath, outputFormat);
            default:
                throw new Error(`Unsupported spreadsheet input format: ${inputExtension}`);
        }
    }

    async convertFromXlsx(inputPath, outputPath, outputFormat) {
        const workbook = XLSX.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        switch (outputFormat) {
            case 'csv':
                const csvData = XLSX.utils.sheet_to_csv(worksheet);
                fs.writeFileSync(outputPath, csvData, 'utf8');
                break;

            case 'html':
                const htmlData = XLSX.utils.sheet_to_html(worksheet);
                const styledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Spreadsheet</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            color: #333;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <h1>Converted Spreadsheet</h1>
    ${htmlData}
</body>
</html>`;
                fs.writeFileSync(outputPath, styledHtml, 'utf8');
                break;

            case 'pdf':
                // Convert to CSV first, then create a simple PDF table
                const csvForPdf = XLSX.utils.sheet_to_csv(worksheet);
                await this.csvToPdf(csvForPdf, outputPath);
                break;

            default:
                throw new Error(`Unsupported output format for XLSX: ${outputFormat}`);
        }

        return { success: true, outputPath };
    }

    async convertFromCsv(inputPath, outputPath, outputFormat) {
        const csvContent = fs.readFileSync(inputPath, 'utf8');

        switch (outputFormat) {
            case 'xlsx':
                const worksheet = XLSX.utils.aoa_to_sheet(
                    csvContent.split('\n').map(row => row.split(','))
                );
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                XLSX.writeFile(workbook, outputPath);
                break;

            case 'html':
                const rows = csvContent.split('\n').filter(row => row.trim());
                const htmlTable = rows.map((row, index) => {
                    const cells = row.split(',').map(cell => cell.trim());
                    const tag = index === 0 ? 'th' : 'td';
                    return `<tr>${cells.map(cell => `<${tag}>${this.escapeHtml(cell)}</${tag}>`).join('')}</tr>`;
                }).join('\n');

                const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted CSV</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            color: #333;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <h1>Converted CSV Data</h1>
    <table>
        ${htmlTable}
    </table>
</body>
</html>`;
                fs.writeFileSync(outputPath, htmlContent, 'utf8');
                break;

            case 'pdf':
                await this.csvToPdf(csvContent, outputPath);
                break;

            default:
                throw new Error(`Unsupported output format for CSV: ${outputFormat}`);
        }

        return { success: true, outputPath };
    }

    async csvToPdf(csvContent, outputPath) {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        const fontSize = 10;
        const margin = 50;
        const lineHeight = fontSize * 1.2;
        
        const rows = csvContent.split('\n').filter(row => row.trim());
        let yPosition = height - margin;
        let currentPage = page;
        
        for (const row of rows) {
            if (yPosition < margin + lineHeight) {
                currentPage = pdfDoc.addPage();
                yPosition = height - margin;
            }
            
            const cells = row.split(',').map(cell => cell.trim());
            const rowText = cells.join(' | ');
            
            currentPage.drawText(rowText, {
                x: margin,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
            
            yPosition -= lineHeight;
        }

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

module.exports = FileConverterEngine;
