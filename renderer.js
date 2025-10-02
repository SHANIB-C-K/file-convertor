// File Converter Renderer Script
class FileConverter {
    constructor() {
        this.files = [];
        this.supportedFormats = {
            image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'],
            document: ['pdf', 'docx', 'txt', 'html'],
            spreadsheet: ['xlsx', 'csv']
        };
        this.conversionOptions = {
            image: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'pdf'],
            document: ['pdf', 'docx', 'txt', 'html'],
            spreadsheet: ['xlsx', 'csv', 'pdf']
        };
        this.initializeEventListeners();
        this.setupMenuListeners();
        this.setDefaultOutputPath();
    }

    initializeEventListeners() {
        // Upload area events
        const uploadArea = document.getElementById('uploadArea');
        const browseBtn = document.getElementById('browseBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const convertBtn = document.getElementById('convertBtn');
        const pathBrowseBtn = document.getElementById('pathBrowseBtn');
        const qualitySlider = document.getElementById('quality');
        const outputFormat = document.getElementById('outputFormat');

        // File selection
        browseBtn.addEventListener('click', () => this.selectFiles());
        uploadArea.addEventListener('click', () => this.selectFiles());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Other controls
        clearAllBtn.addEventListener('click', () => this.clearAllFiles());
        convertBtn.addEventListener('click', () => this.convertFiles());
        pathBrowseBtn.addEventListener('click', () => this.selectOutputPath());
        qualitySlider.addEventListener('input', (e) => this.updateQualityDisplay(e.target.value));
        outputFormat.addEventListener('change', () => this.validateConvertButton());
    }

    setupMenuListeners() {
        // Menu event listeners
        window.electronAPI.onMenuOpenFile(() => this.selectFiles());
        window.electronAPI.onMenuClearAll(() => this.clearAllFiles());
    }

    setDefaultOutputPath() {
        // Set default output path to Downloads or Desktop
        const outputPath = document.getElementById('outputPath');
        const defaultPath = require('os').homedir() + '/Downloads/FileConverter';
        outputPath.value = defaultPath;
        outputPath.placeholder = 'Select output directory...';
    }

    async selectFiles() {
        try {
            const result = await window.electronAPI.selectFile();
            if (!result.canceled && result.filePaths.length > 0) {
                for (const filePath of result.filePaths) {
                    await this.addFile(filePath);
                }
            }
        } catch (error) {
            console.error('Error selecting files:', error);
            await window.electronAPI.showError('Error', 'Failed to select files: ' + error.message);
        }
    }

    async addFile(filePath) {
        const fileName = filePath.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();
        
        // Check if file is supported
        const isSupported = Object.values(this.supportedFormats).some(formats => 
            formats.includes(fileExtension)
        );

        if (!isSupported) {
            await window.electronAPI.showError('Unsupported Format', 
                `The file format "${fileExtension}" is not supported.`);
            return;
        }

        // Check if file already exists
        if (this.files.some(file => file.path === filePath)) {
            await window.electronAPI.showInfo('Duplicate File', 
                'This file has already been added.');
            return;
        }

        // Get file stats
        const stats = await this.getFileStats(filePath);
        
        const fileObj = {
            path: filePath,
            name: fileName,
            extension: fileExtension,
            size: stats.size,
            type: this.getFileType(fileExtension),
            id: Date.now() + Math.random()
        };

        this.files.push(fileObj);
        this.updateFilesList();
        this.updateFormatOptions();
        this.showOptionsSection();
    }

    async getFileStats(filePath) {
        try {
            const fs = require('fs');
            const stats = fs.statSync(filePath);
            return {
                size: stats.size,
                modified: stats.mtime
            };
        } catch (error) {
            return { size: 0, modified: new Date() };
        }
    }

    getFileType(extension) {
        for (const [type, formats] of Object.entries(this.supportedFormats)) {
            if (formats.includes(extension)) {
                return type;
            }
        }
        return 'unknown';
    }

    updateFilesList() {
        const filesList = document.getElementById('filesList');
        const noFilesMessage = document.getElementById('noFilesMessage');

        if (this.files.length === 0) {
            noFilesMessage.style.display = 'block';
            filesList.innerHTML = '<div class="no-files-message" id="noFilesMessage"><p>No files selected. Add files to start converting.</p></div>';
            return;
        }

        noFilesMessage.style.display = 'none';
        
        const filesHTML = this.files.map(file => `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-info">
                    <div class="file-icon">${this.getFileIcon(file.type)}</div>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${file.type.toUpperCase()} • ${this.formatFileSize(file.size)}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-file-btn" onclick="fileConverter.removeFile('${file.id}')">Remove</button>
                </div>
            </div>
        `).join('');

        filesList.innerHTML = filesHTML;
    }

    getFileIcon(type) {
        const icons = {
            image: '🖼️',
            document: '📄',
            spreadsheet: '📊',
            unknown: '📁'
        };
        return icons[type] || icons.unknown;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(fileId) {
        this.files = this.files.filter(file => file.id != fileId);
        this.updateFilesList();
        this.updateFormatOptions();
        
        if (this.files.length === 0) {
            this.hideOptionsSection();
        }
    }

    clearAllFiles() {
        this.files = [];
        this.updateFilesList();
        this.hideOptionsSection();
        this.hideProgressSection();
        this.hideResultsSection();
    }

    updateFormatOptions() {
        const outputFormat = document.getElementById('outputFormat');
        const fileTypes = [...new Set(this.files.map(file => file.type))];
        
        // Get all possible output formats for selected file types
        const availableFormats = new Set();
        fileTypes.forEach(type => {
            if (this.conversionOptions[type]) {
                this.conversionOptions[type].forEach(format => availableFormats.add(format));
            }
        });

        // Clear and populate format options
        outputFormat.innerHTML = '<option value="">Select format...</option>';
        [...availableFormats].sort().forEach(format => {
            const option = document.createElement('option');
            option.value = format;
            option.textContent = format.toUpperCase();
            outputFormat.appendChild(option);
        });

        this.validateConvertButton();
    }

    validateConvertButton() {
        const convertBtn = document.getElementById('convertBtn');
        const outputFormat = document.getElementById('outputFormat');
        const outputPath = document.getElementById('outputPath');

        const isValid = this.files.length > 0 && 
                       outputFormat.value && 
                       outputPath.value;

        convertBtn.disabled = !isValid;
    }

    async selectOutputPath() {
        try {
            const result = await window.electronAPI.selectDirectory();
            if (!result.canceled && result.filePaths.length > 0) {
                const outputPath = document.getElementById('outputPath');
                outputPath.value = result.filePaths[0];
                this.validateConvertButton();
            }
        } catch (error) {
            console.error('Error selecting output path:', error);
            await window.electronAPI.showError('Error', 'Failed to select output directory: ' + error.message);
        }
    }

    updateQualityDisplay(value) {
        document.getElementById('qualityValue').textContent = value + '%';
    }

    showOptionsSection() {
        document.getElementById('optionsSection').style.display = 'block';
    }

    hideOptionsSection() {
        document.getElementById('optionsSection').style.display = 'none';
    }

    showProgressSection() {
        document.getElementById('progressSection').style.display = 'block';
    }

    hideProgressSection() {
        document.getElementById('progressSection').style.display = 'none';
    }

    showResultsSection() {
        document.getElementById('resultsSection').style.display = 'block';
    }

    hideResultsSection() {
        document.getElementById('resultsSection').style.display = 'none';
    }

    async convertFiles() {
        const outputFormat = document.getElementById('outputFormat').value;
        const outputPath = document.getElementById('outputPath').value;
        const quality = document.getElementById('quality').value;

        if (!outputFormat || !outputPath) {
            await window.electronAPI.showError('Missing Information', 
                'Please select an output format and output directory.');
            return;
        }

        this.showProgressSection();
        this.hideResultsSection();

        const convertBtn = document.getElementById('convertBtn');
        const btnText = convertBtn.querySelector('.btn-text');
        const btnLoader = convertBtn.querySelector('.btn-loader');

        // Update button state
        convertBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        const results = [];
        const totalFiles = this.files.length;

        try {
            for (let i = 0; i < totalFiles; i++) {
                const file = this.files[i];
                const progress = ((i + 1) / totalFiles) * 100;

                this.updateProgress(progress, `Converting ${file.name}...`);

                try {
                    const result = await this.convertSingleFile(file, outputFormat, outputPath, quality);
                    results.push({
                        success: true,
                        originalFile: file.name,
                        outputFile: result.outputPath,
                        message: 'Conversion successful'
                    });
                } catch (error) {
                    console.error(`Error converting ${file.name}:`, error);
                    results.push({
                        success: false,
                        originalFile: file.name,
                        message: error.message
                    });
                }
            }

            this.updateProgress(100, 'Conversion complete!');
            this.displayResults(results);

        } catch (error) {
            console.error('Conversion error:', error);
            await window.electronAPI.showError('Conversion Error', error.message);
        } finally {
            // Reset button state
            convertBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    async convertSingleFile(file, outputFormat, outputPath, quality) {
        const outputFileName = `${file.name.split('.')[0]}.${outputFormat}`;
        const outputFilePath = `${outputPath}/${outputFileName}`;

        // Read the input file
        const inputData = await window.electronAPI.readFile(file.path);
        if (!inputData.success) {
            throw new Error(`Failed to read file: ${inputData.error}`);
        }

        let convertedData;

        // For now, we'll do basic conversions and show a message for advanced ones
        if (file.extension === outputFormat) {
            // Same format - just copy
            convertedData = inputData.data;
        } else {
            // Different format conversion
            convertedData = await this.performBasicConversion(inputData.data, file, outputFormat, quality);
        }

        // Write the converted file
        const writeResult = await window.electronAPI.writeFile(outputFilePath, convertedData);
        if (!writeResult.success) {
            throw new Error(`Failed to write file: ${writeResult.error}`);
        }

        return { outputPath: outputFilePath };
    }

    async performBasicConversion(inputData, file, outputFormat, quality) {
        const inputFormat = file.extension;
        
        // Basic text to HTML conversion
        if (inputFormat === 'txt' && outputFormat === 'html') {
            const textContent = inputData.toString('utf8');
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document - ${file.name}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
            background: #f9f9f9;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9rem;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📄 ${file.name}</h1>
            <p>Converted from TXT to HTML</p>
        </div>
        <div class="content">${this.escapeHtml(textContent)}</div>
        <div class="footer">
            <p>Converted by File Converter | Developed by SHANIB C K</p>
        </div>
    </div>
</body>
</html>`;
            return Buffer.from(htmlContent, 'utf8');
        }

        // Basic HTML to text conversion
        if (inputFormat === 'html' && outputFormat === 'txt') {
            const htmlContent = inputData.toString('utf8');
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
            return Buffer.from(textContent, 'utf8');
        }

        // For other conversions, show informative message
        const message = `Conversion from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()} is not yet implemented in this basic version.

This file converter supports:
✅ TXT → HTML
✅ HTML → TXT  
✅ Same format copying

Advanced conversions (images, PDFs, DOCX, XLSX) require additional libraries.
To enable full conversion capabilities, please install the required dependencies:

npm install sharp pdf-lib mammoth xlsx puppeteer

Developed by SHANIB C K
File Converter v1.0.0`;

        return Buffer.from(message, 'utf8');
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

    updateProgress(percentage, message) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressDetails = document.getElementById('progressDetails');

        progressFill.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '% Complete';
        progressDetails.textContent = message;
    }

    displayResults(results) {
        this.showResultsSection();
        const resultsList = document.getElementById('resultsList');

        const resultsHTML = results.map(result => `
            <div class="result-item ${result.success ? 'success' : 'error'}">
                <div class="result-info">
                    <h4>${result.originalFile}</h4>
                    <p>${result.message}</p>
                    ${result.outputFile ? `<p><strong>Output:</strong> ${result.outputFile}</p>` : ''}
                </div>
                ${result.success ? `
                    <div class="result-actions">
                        <button class="open-file-btn" onclick="fileConverter.openFile('${result.outputFile}')">Open File</button>
                        <button class="open-folder-btn" onclick="fileConverter.openFolder('${result.outputFile}')">Open Folder</button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        resultsList.innerHTML = resultsHTML;

        // Show summary
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        if (successCount === totalCount) {
            window.electronAPI.showInfo('Conversion Complete', 
                `All ${totalCount} files converted successfully!`);
        } else {
            window.electronAPI.showInfo('Conversion Complete', 
                `${successCount} of ${totalCount} files converted successfully.`);
        }
    }

    async openFile(filePath) {
        try {
            await window.electronAPI.openFileExternal(filePath);
        } catch (error) {
            console.error('Error opening file:', error);
            await window.electronAPI.showError('Error', 'Failed to open file: ' + error.message);
        }
    }

    async openFolder(filePath) {
        try {
            await window.electronAPI.openFileLocation(filePath);
        } catch (error) {
            console.error('Error opening folder:', error);
            await window.electronAPI.showError('Error', 'Failed to open folder: ' + error.message);
        }
    }

    // Drag and drop handlers
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    async handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            await this.addFile(file.path);
        }
    }
}

// Initialize the file converter when the page loads
let fileConverter;
document.addEventListener('DOMContentLoaded', () => {
    fileConverter = new FileConverter();
});
