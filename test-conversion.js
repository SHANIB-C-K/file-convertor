// Quick test script to verify file conversion
const fs = require('fs');
const path = require('path');

// Test basic text to HTML conversion
function testConversion() {
    console.log('🧪 Testing File Conversion...\n');
    
    // Read sample.txt
    const inputFile = './sample.txt';
    const outputFile = './test-output/sample.html';
    
    if (!fs.existsSync(inputFile)) {
        console.log('❌ sample.txt not found');
        return;
    }
    
    try {
        // Read input file
        const textContent = fs.readFileSync(inputFile, 'utf8');
        console.log('✅ Read input file:', inputFile);
        
        // Create HTML content
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document - sample.txt</title>
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
            <h1>📄 sample.txt</h1>
            <p>Converted from TXT to HTML</p>
        </div>
        <div class="content">${escapeHtml(textContent)}</div>
        <div class="footer">
            <p>Converted by File Converter | Developed by SHANIB C K</p>
        </div>
    </div>
</body>
</html>`;
        
        // Create output directory if it doesn't exist
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log('✅ Created output directory:', outputDir);
        }
        
        // Write output file
        fs.writeFileSync(outputFile, htmlContent, 'utf8');
        console.log('✅ Created output file:', outputFile);
        
        console.log('\n🎉 Conversion test successful!');
        console.log('📁 Check the output file at:', path.resolve(outputFile));
        console.log('🌐 Open it in a browser to see the formatted result');
        
    } catch (error) {
        console.log('❌ Conversion test failed:', error.message);
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Run the test
testConversion();
