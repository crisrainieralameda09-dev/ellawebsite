# 🔐 Developer Guide - Download Code System

## Quick Start for Developers

### Accessing the Code Generator
1. Open the LET Reviewer website (`index.html`)
2. **Triple-click** the logo (🎓) in the top-left corner
3. You'll be redirected to the hidden developer portal

### Generating Download Codes
1. Click the "🎲 Generate New Code" button
2. A unique 6-character code will be generated (e.g., `A3B7K9`)
3. The code is automatically copied to your clipboard
4. Share this code with users who need to download the app

### Code Management
- View all generated codes in the "Generated Codes" section
- See which codes are ACTIVE (unused) or USED (already consumed)
- Codes are stored in browser localStorage
- Each code can only be used once

## User Experience

### How Users Download
1. User clicks "Download APK" button on the website
2. A modal appears asking for a download code
3. User enters the 6-character code you provided
4. System verifies the code:
   - ✅ **Valid & Unused** → Download starts immediately
   - ❌ **Invalid** → Error: "Invalid code. Please check and try again."
   - ⚠️ **Already Used** → Error: "This code has already been used."
5. Download proceeds, and code is marked as used

## Technical Implementation

### Files Overview
- **`code-manager.js`**: Core logic for code generation, verification, and storage
- **`dev-keygen.html`**: Developer portal for generating codes
- **`index.html`**: Main website with code verification modal
- **`script.js`**: Handles modal interactions and hidden developer access

### Code Format
- **Length**: 6 characters
- **Characters**: A-Z (uppercase) and 2-9 (numbers)
- **Excluded**: I, O, 0, 1 (to avoid confusion)
- **Example**: `AB3K7Y`, `MN8Q4P`

### Storage Structure
```javascript
[
  {
    code: "AB3K7Y",
    generated: 1698654321000,  // timestamp
    used: false,
    usedAt: null
  },
  {
    code: "MN8Q4P",
    generated: 1698654500000,
    used: true,
    usedAt: 1698660000000
  }
]
```

### API Functions (window.CodeManager)
```javascript
// Generate a new unique code
CodeManager.generateCode() → returns "AB3K7Y"

// Verify if code is valid and unused
CodeManager.verifyCode(code) → {valid: true/false, message: "..."}

// Mark code as used
CodeManager.markCodeAsUsed(code) → true/false

// Get all codes with status
CodeManager.getAllCodes() → [...]

// Get statistics
CodeManager.getStats() → {total: 10, active: 5, used: 5}
```

## Security Features

### One-Time Use Enforcement
- Once a code is used to download the APK, it's permanently marked as used
- The system checks both validity and usage status before allowing download
- No code can be reused, even if manually reset in localStorage

### Hidden Developer Access
- Developer portal is not linked anywhere on the public website
- Only accessible via secret gesture (triple-click logo)
- Regular users won't discover this feature accidentally

### Local Storage
- All codes stored in browser localStorage under key `let_reviewer_codes`
- Data persists across browser sessions
- Clearing browser data will reset all codes

## Customization

### Change Secret Access Gesture
Edit `script.js` line ~180:
```javascript
const secretPattern = ['logo-icon', 'logo-icon', 'logo-icon']; // Triple-click
```

### Change Code Length
Edit `code-manager.js` line ~17:
```javascript
for (let i = 0; i < 6; i++) { // Change 6 to desired length
```

### Change Code Characters
Edit `code-manager.js` line ~16:
```javascript
const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Modify this
```

## Troubleshooting

### Developer portal not accessible
- Ensure you're triple-clicking the logo icon, not the text
- Try clicking rapidly three times within 1 second
- Check browser console for any JavaScript errors

### Codes not saving
- Check if localStorage is enabled in the browser
- Check browser privacy settings (some modes block localStorage)
- Try a different browser

### Download not starting after code verification
- Check if `LETReviewer.apk` file exists in the same directory
- Check browser console for download errors
- Ensure popup blockers aren't preventing the download

## Best Practices

1. **Generate codes in batches** when you have multiple users
2. **Keep track** of which users received which codes (external to the system)
3. **Clear old codes** periodically by accessing localStorage
4. **Test the flow** before distributing codes to users
5. **Provide clear instructions** to users along with the code

## Testing

### Test the Developer Portal
1. Open `index.html` in a browser
2. Triple-click the logo
3. Generate a test code
4. Verify it appears in the list as "ACTIVE"

### Test the User Flow
1. Go back to the main website
2. Click "Download APK"
3. Enter the test code
4. Verify download starts
5. Try using the same code again - should show "already used" error

## Support

For issues or questions about the code system, check:
- Browser console for error messages
- `README.md` for general website information
- Source code comments in `code-manager.js` and `script.js`

---

**Made with ❤️ for Filipino Teachers | Mabuhay! 🇵🇭**
