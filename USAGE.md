# 🚀 Quick Start Guide - File Converter

## Getting Started

### 1. Launch the Application
```bash
# Method 1: Use the start script
./start.sh

# Method 2: Use npm directly
npm start

# Method 3: Development mode (with DevTools)
npm run dev
```

### 2. Basic Usage Steps

1. **Add Files**
   - Drag & drop files into the upload area
   - Or click "Browse Files" to select files
   - Supported: TXT, HTML, PNG, JPG, PDF, DOCX, XLSX, CSV, etc.

2. **Choose Output Format**
   - Select desired format from dropdown
   - Available options depend on input file types

3. **Set Options**
   - Adjust image quality (10-100%)
   - Choose output directory

4. **Convert**
   - Click "Convert Files"
   - Watch real-time progress
   - Access converted files from results

## Current Capabilities

### ✅ Working Conversions
- **TXT → HTML**: Creates beautifully formatted HTML with styling
- **HTML → TXT**: Extracts clean text from HTML
- **Same Format**: Perfect copying for backup/organization

### 🔄 Advanced Conversions (Requires Additional Libraries)
To enable full conversion capabilities:

```bash
# Install advanced conversion libraries
npm install sharp pdf-lib mammoth xlsx puppeteer
```

Then restart the application for full functionality:
- **Images**: PNG ↔ JPG ↔ WebP ↔ SVG ↔ GIF ↔ BMP
- **Documents**: PDF ↔ DOCX ↔ TXT ↔ HTML
- **Spreadsheets**: XLSX ↔ CSV ↔ PDF ↔ HTML

## Testing the Application

### Try These Sample Conversions:

1. **Text to HTML**
   - Use the included `sample.txt` file
   - Convert to HTML format
   - Open the result to see beautiful formatting

2. **HTML to Text**
   - Create an HTML file or download one
   - Convert to TXT to extract clean text

3. **File Organization**
   - Use same-format conversion for file copying
   - Organize files into different directories

## Keyboard Shortcuts

- `Ctrl+O` (Cmd+O): Open files
- `Ctrl+Shift+C`: Clear all files
- `F11`: Toggle fullscreen
- `Ctrl+R`: Reload application
- `F12`: Toggle DevTools (development mode)

## Tips & Tricks

### 🎯 Best Practices
- **Batch Processing**: Add multiple files for efficient conversion
- **Quality Settings**: Use 90% quality for best balance of size/quality
- **Output Organization**: Create dedicated folders for converted files
- **Format Selection**: Choose formats based on your end use case

### 🔧 Troubleshooting
- **App won't start**: Ensure Node.js 16+ is installed
- **Conversion fails**: Check file permissions and available disk space
- **Missing formats**: Install additional libraries for advanced conversions
- **Performance**: Close other applications for large file conversions

### 📁 File Management
- **Input Files**: Keep originals safe, app creates copies
- **Output Location**: Choose easily accessible directories
- **Naming**: Converted files keep original names with new extensions
- **Batch Results**: Check results section for conversion status

## Advanced Usage

### Development Mode
```bash
npm run dev
```
- Opens DevTools for debugging
- Hot reload for development
- Console logging for troubleshooting

### Building Executables
```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:linux    # .deb and AppImage
npm run build:win      # .exe installer
npm run build:mac      # .dmg package
```

### Custom Configuration
Edit `package.json` to customize:
- Application metadata
- Build configurations
- Dependency management
- Script commands

## Support & Development

**Developer**: SHANIB C K  
**Version**: 1.0.0  
**Platform**: Cross-platform (Windows, macOS, Linux)  
**Framework**: Electron.js  

### Getting Help
1. Check console output for error messages
2. Verify file formats are supported
3. Ensure sufficient system resources
4. Try converting single files first

### Contributing
- Fork the repository
- Create feature branches
- Test on multiple platforms
- Submit pull requests

---

**Happy Converting!** 🎉

*Transform your files with ease and confidence.*
