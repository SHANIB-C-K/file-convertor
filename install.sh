#!/bin/bash

# File Converter Installation Script
# Developed by SHANIB C K

echo "🔄 File Converter Installation Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 16
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -ge 16 ]; then
            print_success "Node.js version is compatible"
        else
            print_warning "Node.js version should be 16 or higher for best compatibility"
        fi
    else
        print_error "Node.js is not installed!"
        echo "Please install Node.js from https://nodejs.org/"
        echo "Recommended version: 18.x or higher"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: v$NPM_VERSION"
    else
        print_error "npm is not installed!"
        echo "npm should come with Node.js installation"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    echo "This may take a few minutes..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        echo "Please check your internet connection and try again"
        exit 1
    fi
}

# Create desktop entry (Linux only)
create_desktop_entry() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_status "Creating desktop entry..."
        
        DESKTOP_FILE="$HOME/.local/share/applications/file-converter.desktop"
        CURRENT_DIR=$(pwd)
        
        mkdir -p "$HOME/.local/share/applications"
        
        cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=File Converter
Comment=Universal file format converter
Exec=bash -c "cd '$CURRENT_DIR' && npm start"
Icon=$CURRENT_DIR/assets/icon.svg
Terminal=false
Categories=Utility;Office;
StartupWMClass=file-converter
EOF
        
        chmod +x "$DESKTOP_FILE"
        print_success "Desktop entry created at $DESKTOP_FILE"
    fi
}

# Create start script
create_start_script() {
    print_status "Creating start script..."
    
    cat > "start.sh" << 'EOF'
#!/bin/bash

# File Converter Start Script
# Developed by SHANIB C K

echo "🔄 Starting File Converter..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the File Converter directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing..."
    npm install
fi

# Start the application
npm start
EOF
    
    chmod +x "start.sh"
    print_success "Start script created: start.sh"
}

# Main installation process
main() {
    echo "Starting installation process..."
    echo ""
    
    # System checks
    check_nodejs
    check_npm
    
    echo ""
    
    # Installation
    install_dependencies
    
    echo ""
    
    # Post-installation setup
    create_start_script
    create_desktop_entry
    
    echo ""
    echo "============================================"
    print_success "File Converter installation completed!"
    echo "============================================"
    echo ""
    echo "📋 How to run the application:"
    echo "   Method 1: Run './start.sh' in this directory"
    echo "   Method 2: Run 'npm start' in this directory"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "   Method 3: Search for 'File Converter' in your applications menu"
    fi
    echo ""
    echo "🔧 Development mode:"
    echo "   Run 'npm run dev' for development with DevTools"
    echo ""
    echo "📦 Build executable:"
    echo "   Run 'npm run build' to create distributable packages"
    echo ""
    echo "🎯 Supported formats:"
    echo "   • Images: PNG, JPG, SVG, WebP, GIF, BMP"
    echo "   • Documents: PDF, DOCX, TXT, HTML"
    echo "   • Spreadsheets: XLSX, CSV"
    echo ""
    echo "Developed by SHANIB C K"
    echo "Enjoy converting your files! 🚀"
}

# Run main function
main
