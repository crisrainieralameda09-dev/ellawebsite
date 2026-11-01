# LET Reviewer PH - Website

Official website and APK download for the LET Reviewer PH Android app.

## 📦 Latest APK

**File**: `LETReviewer.apk`  
**Version**: 1.0  
**Size**: 5.04 MB (5,045,308 bytes)  
**Build Date**: October 26, 2026 11:40 PM  
**Status**: ✅ Latest Correct Build

### What's Included
- ✅ All 29 LET subjects with AI tutors
- ✅ Gemini API key pre-configured
- ✅ Chat, Quiz, and Study Plan features
- ✅ Dark theme Material Design 3 UI
- ✅ No "Click me" buttons - proper LET Reviewer interface

## 🌐 Website Files

- `index.html` - Main landing page with code verification
- `styles.css` - Website styling
- `script.js` - Interactive features + hidden developer access
- `code-manager.js` - Code generation and verification system
- `dev-keygen.html` - Developer code generator portal (hidden)
- `LETReviewer.apk` - Android app download (5.04 MB)

## 🔐 Download Code System

The website now includes a secure one-time code system for APK downloads:

### For Developers
1. **Access Code Generator**: 
   - Method 1: Click "Admin" link in the footer (Resources section)
   - Method 2: Triple-click the logo (🎓) in the navbar
2. **Enter Admin Password**: `Crisalameda09`
3. **Generate Codes**: Click "Generate New Code" to create a 6-character access code
4. **Share Code**: Give the code to users who want to download the app
5. **Track Usage**: View all generated codes and their status (active/used)

### For Users
1. Click the "Download APK" button on the website
2. Enter the 6-character code provided by the developer
3. Click "Verify & Download" to start the download
4. Note: Each code works only once

### How It Works
- Developer generates unique 6-character codes (letters and numbers, no confusing chars)
- Codes are stored in browser localStorage
- Each code can only be used once
- Used codes are marked and cannot be reused
- System prevents invalid or already-used codes

### Technical Details
- **Code Format**: 6 uppercase alphanumeric characters (excluding I, O, 0, 1)
- **Storage**: Browser localStorage (`let_reviewer_codes`)
- **Verification**: Real-time validation before download
- **Security**: One-time use enforced, tracked with timestamps

## 🚀 How to Deploy

### Local Testing
1. Open `index.html` in a web browser
2. Click the download button to test APK download

### GitHub Pages
1. Create a repository
2. Upload all files (index.html, styles.css, script.js, LETReviewer.apk)
3. Enable GitHub Pages in Settings
4. Access at: `https://yourusername.github.io/repository-name`

### Web Server
1. Upload all files to your web server
2. Ensure APK MIME type is set correctly:
   - MIME type: `application/vnd.android.package-archive`
   - Extension: `.apk`

## 📱 APK Details

### Build Information
- **Package**: com.letreviewer
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 30 (Android 11)
- **Build Type**: Debug

### Features
1. **Splash Screen** - Animated logo with 2-second delay
2. **Main Screen** - 29 subject cards with search and filters
3. **Chat Screen** - AI-powered subject tutors
4. **Quiz Screen** - AI-generated 10-question quizzes
5. **Settings** - API key management

### 
## 🔄 Update Instructions

When a new APK is built:

1. **Copy new APK**:
   ```bash
   copy "D:\Android\AndroidProjectTemplate\app\build\outputs\apk\debug\app-debug.apk" "LETReviewer-Website\LETReviewer.apk"
   ```

2. **Update index.html**:
   - Update file size in download button
   - Update build date if shown
   - Update version number if changed

3. **Upload to server**:
   - Upload updated `LETReviewer.apk`
   - Upload updated `index.html`

## 📊 Download Analytics

The website includes download tracking via the `trackDownload()` function in `script.js`.

## 🔗 Important Links

- **Get Gemini API Key**: https://aistudio.google.com/app/apikey
- **Android Developer**: https://developer.android.com

## ✅ Verification

Users should see:
- Splash screen: "LET Reviewer PH" with logo
- Main screen: 29 subject cards (NOT "Click me" buttons)
- Chat: AI welcome messages
- Quiz: 10 AI-generated questions
- Dark blue theme throughout

## 📝 License

Made with ❤️ for Filipino Teachers  
Mabuhay ang mga guro ng Pilipinas! 🇵🇭
