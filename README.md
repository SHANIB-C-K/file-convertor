# 🔄 File Converter

A powerful, universal file format converter built with Electron.js. Convert between various file formats including images, documents, and spreadsheets with an intuitive drag-and-drop interface.

**Developed by SHANIB C K**

## ✨ Features

- **Universal Format Support**: Convert between 15+ file formats
- **Drag & Drop Interface**: Simply drag files into the application
- **Batch Conversion**: Convert multiple files simultaneously
- **Quality Control**: Adjust image quality and conversion settings
- **Progress Tracking**: Real-time conversion progress with detailed feedback
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Modern UI**: Beautiful, responsive interface with dark/light themes
- **Secure**: No internet connection required - all processing is local

## 📁 Supported Formats

### Images
- **Input/Output**: PNG, JPG/JPEG, WebP, GIF, BMP, TIFF, SVG
- **Special**: Convert images to PDF

### Documents
- **Input/Output**: PDF, DOCX, TXT, HTML
- **Features**: Text extraction, HTML generation, PDF creation

### Spreadsheets
- **Input/Output**: XLSX, CSV
- **Features**: Convert to PDF, HTML tables

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm (comes with Node.js)

### Installation

1. **Clone or download** this repository
2. **Navigate** to the project directory:
   ```bash
   cd "file convertor"
   ```
3. **Run the installation script**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

### Running the Application

**Method 1: Using the start script**
```bash
./start.sh
```

**Method 2: Using npm**
```bash
npm start
```

**Method 3: Development mode (with DevTools)**
```bash
npm run dev
```

## 🛠️ Manual Installation

If you prefer to install manually:

```bash
# Install dependencies
npm install

# Start the application
npm start
```

## 📦 Building Executables

Create distributable packages for different platforms:

```bash
# Build for current platform
npm run build

# Build for Linux
npm run build:linux

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac
```

Built packages will be available in the `dist/` directory.

## 🎯 How to Use

1. **Launch** the File Converter application
2. **Add Files**: 
   - Drag and drop files into the upload area, or
   - Click "Browse Files" to select files
3. **Choose Output Format**: Select your desired output format from the dropdown
4. **Set Options**: 
   - Adjust image quality (for image conversions)
   - Choose output directory
5. **Convert**: Click "Convert Files" to start the process
6. **Download**: Access your converted files from the results section

## 🔧 Advanced Features

### Batch Processing
- Add multiple files of different formats
- Convert them all to the same output format
- Progress tracking for each file

### Quality Control
- Adjust image quality from 10% to 100%
- Resize images during conversion (coming soon)
- Compression options for different formats

### Keyboard Shortcuts
- `Ctrl+O` (Cmd+O): Open files
- `Ctrl+Shift+C`: Clear all files
- `F11`: Toggle fullscreen
- `Ctrl+R`: Reload application

## 🏗️ Project Structure

```
file-converter/
├── main.js              # Main Electron process
├── preload.js           # Secure IPC bridge
├── renderer.js          # Frontend logic
├── converter.js         # File conversion engine
├── index.html           # Main UI
├── styles.css           # Application styles
├── splash.html          # Splash screen
├── package.json         # Project configuration
├── install.sh           # Installation script
├── start.sh             # Start script
├── assets/              # Application icons
└── README.md           # This file
```

## 🔒 Security Features

- **Sandboxed Renderer**: Frontend runs in a secure sandbox
- **Context Isolation**: Secure communication between processes
- **No Remote Code**: All processing happens locally
- **File Validation**: Input validation and format checking
- **Safe File Handling**: Secure file read/write operations

## 🐛 Troubleshooting

### Common Issues

**Application won't start:**
- Ensure Node.js 16+ is installed
- Run `npm install` to install dependencies
- Check console for error messages

**Conversion fails:**
- Verify input file is not corrupted
- Check available disk space
- Ensure output directory is writable

**Missing dependencies:**
- Run the installation script: `./install.sh`
- Or manually install: `npm install`

### Getting Help

1. Check the console output for error messages
2. Verify file formats are supported
3. Ensure sufficient system resources
4. Try converting a single file first

## 🔄 Conversion Details

### Image Conversions
- Uses Sharp library for high-quality processing
- Supports transparency preservation
- Maintains EXIF data where possible
- Batch resize capabilities

### Document Conversions
- Text extraction from DOCX files
- HTML generation with styling
- PDF creation with proper formatting
- Character encoding preservation

### Spreadsheet Conversions
- Preserves cell formatting where possible
- Supports multiple sheets (first sheet only)
- CSV delimiter detection
- HTML table generation

## 🚧 Roadmap

- [ ] **More Formats**: Add support for PowerPoint, RTF, ODT
- [ ] **Cloud Integration**: Google Drive, Dropbox sync
- [ ] **Advanced Options**: Image resize, PDF merge/split
- [ ] **Themes**: Dark mode, custom themes
- [ ] **Plugins**: Extensible conversion system
- [ ] **API**: REST API for automation
- [ ] **Mobile**: React Native version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
```bash
git clone <repository-url>
cd file-converter
npm install
npm run dev
```

### Code Style
- Use ES6+ features
- Follow Electron security best practices
- Add comments for complex logic
- Test on multiple platforms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**SHANIB C K**
- GitHub: [@shanib-c-k](https://github.com/shanib-c-k)
- Email: [dev.shanibck@gmail.com]

## 🙏 Acknowledgments

- **Electron.js** - Cross-platform desktop framework
- **Sharp** - High-performance image processing
- **PDF-lib** - PDF generation and manipulation
- **Mammoth** - DOCX to HTML conversion
- **XLSX** - Spreadsheet processing

## 📊 System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.14, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB
- **Storage**: 500MB free space
- **Node.js**: 16.x or higher

### Recommended Requirements
- **OS**: Latest version of Windows, macOS, or Linux
- **RAM**: 8GB or more
- **Storage**: 1GB free space
- **Node.js**: 18.x or higher

---

**Made with ❤️ by SHANIB C K**

*Convert files with confidence and ease!* 🚀
