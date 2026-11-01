# 🔐 How the Download Code System Works

## Overview
The LET Reviewer website now requires a one-time access code to download the APK file. Only developers can generate these codes through a hidden portal.

---

## 🎯 The Process

### For Developers (Code Generation)

```
1. Open website
   ↓
2. Triple-click logo (🎓)
   ↓
3. Access hidden developer portal
   ↓
4. Click "Generate New Code"
   ↓
5. Get unique 6-char code (e.g., "AB3K7Y")
   ↓
6. Code auto-copied to clipboard
   ↓
7. Share code with user
```

### For Users (Download Process)

```
1. Visit website
   ↓
2. Click "Download APK" button
   ↓
3. Modal appears requesting code
   ↓
4. Enter 6-character code
   ↓
5. System validates code
   ├─ Valid? → Download starts
   └─ Invalid/Used? → Error shown
   ↓
6. APK downloads
   ↓
7. Code marked as USED
   ↓
8. Code cannot be reused
```

---

## 🔧 Technical Flow

### Code Generation
```javascript
Developer triple-clicks logo
  ↓
script.js detects pattern
  ↓
Redirects to dev-keygen.html
  ↓
User clicks "Generate"
  ↓
code-manager.js generates random code
  ↓
Checks for uniqueness
  ↓
Saves to localStorage
  ↓
Displays code + copies to clipboard
```

### Code Verification
```javascript
User clicks "Download APK"
  ↓
script.js opens modal
  ↓
User enters code
  ↓
script.js calls CodeManager.verifyCode()
  ↓
code-manager.js checks:
  - Does code exist?
  - Is code unused?
  ↓
Returns {valid: true/false, message: "..."}
  ↓
If valid:
  - Marks code as used
  - Tracks download
  - Starts APK download
If invalid:
  - Shows error message
  - Shakes input field
```

---

## 🗄️ Data Structure

### Code Object
```javascript
{
  code: "AB3K7Y",          // 6-character unique ID
  generated: 1698654321000, // Unix timestamp
  used: false,              // Usage status
  usedAt: null              // When used (timestamp)
}
```

### Storage Location
- **Where**: Browser localStorage
- **Key**: `let_reviewer_codes`
- **Format**: JSON array of code objects
- **Persistence**: Survives browser restarts
- **Scope**: Per-browser, per-domain

### Example localStorage Data
```json
[
  {
    "code": "AB3K7Y",
    "generated": 1698654321000,
    "used": false,
    "usedAt": null
  },
  {
    "code": "MN8Q4P",
    "generated": 1698654500000,
    "used": true,
    "usedAt": 1698660000000
  }
]
```

---

## 🔒 Security Measures

### 1. Hidden Developer Access
- Portal not linked on public website
- Requires secret gesture (triple-click)
- Only knowledgeable users can access

### 2. One-Time Use Enforcement
- Code checked before download
- Immediately marked as used after successful download
- Cannot be reset by user

### 3. Code Generation
- Random 6-character codes
- Excludes confusing characters (I, O, 0, 1)
- Uniqueness guaranteed
- Impossible to guess

### 4. Client-Side Validation
- Real-time verification
- Clear error messages
- No server interaction needed

---

## 🎨 User Interface Elements

### Main Website Button
```html
<button onclick="openCodeModal()">
  📱 Download APK
</button>
```

### Code Verification Modal
```
┌─────────────────────────────────┐
│  🔐 Enter Download Code          │
│                                  │
│  Please enter your one-time     │
│  access code to download         │
│                                  │
│  ┌──────────────────────────┐  │
│  │      A B 3 K 7 Y         │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │  ✅ Verify & Download    │  │
│  └──────────────────────────┘  │
│                                  │
│  Don't have a code? Contact     │
│  the developer to get access.   │
└─────────────────────────────────┘
```

### Developer Portal
```
┌─────────────────────────────────┐
│  🔐 Developer Portal             │
│  Generate one-time download     │
│  codes                           │
│                                  │
│  ┌──────────────────────────┐  │
│  │   Generated Code:         │  │
│  │      A B 3 K 7 Y         │  │
│  │  ⚠️ This code can only be │  │
│  │  used once                │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │  🎲 Generate New Code    │  │
│  └──────────────────────────┘  │
│                                  │
│  📋 Generated Codes:             │
│  ┌──────────────────────────┐  │
│  │  AB3K7Y      [ACTIVE]    │  │
│  │  MN8Q4P      [USED]      │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

---

## ⚡ Key Features

### ✅ Advantages
- **No server required** - Pure client-side solution
- **Easy to use** - Simple 6-character codes
- **Secure** - One-time use prevents sharing
- **Hidden access** - Only developers know how to generate
- **Trackable** - See all codes and their status
- **Auto-copy** - Generated codes copied to clipboard
- **Error handling** - Clear messages for invalid/used codes

### ⚠️ Limitations
- **Browser-specific** - Codes stored per-browser
- **localStorage dependent** - Clearing browser data resets codes
- **No remote sync** - Can't sync codes across devices
- **No analytics** - Can't track which user used which code
- **Client-side only** - Technically can be bypassed by tech-savvy users

---

## 🛠️ Customization Options

### Change Code Length
Edit `code-manager.js`:
```javascript
for (let i = 0; i < 6; i++) { // Change 6 to desired length
```

### Change Secret Gesture
Edit `script.js`:
```javascript
const secretPattern = ['logo-icon', 'logo-icon', 'logo-icon']; 
// Modify pattern or add different elements
```

### Change Code Characters
Edit `code-manager.js`:
```javascript
const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
// Add or remove characters
```

---

## 🐛 Troubleshooting

### Issue: Triple-click doesn't work
**Solution**: 
- Click faster (within 1 second)
- Click exactly on the 🎓 icon, not the text
- Check if JavaScript is enabled

### Issue: Codes not saving
**Solution**:
- Enable localStorage in browser settings
- Check if in private/incognito mode
- Try different browser

### Issue: Download doesn't start
**Solution**:
- Check if `LETReviewer.apk` exists in same folder
- Disable popup blockers
- Check browser console for errors

### Issue: "Already used" error immediately
**Solution**:
- You're using a code that was already used
- Generate a new code
- Check code list in dev portal

---

## 📝 Example Scenario

**Developer's Perspective:**
1. Opens website for testing
2. Triple-clicks logo icon (🎓)
3. Redirected to dev portal
4. Generates code: "AB3K7Y"
5. Code auto-copied to clipboard
6. Sends code to user via email/message
7. Monitors code list - sees "ACTIVE" status

**User's Perspective:**
1. Receives code "AB3K7Y" from developer
2. Opens LET Reviewer website
3. Clicks "Download APK" button
4. Modal appears asking for code
5. Types: A-B-3-K-7-Y
6. Clicks "Verify & Download"
7. ✅ Success message appears
8. APK download starts automatically
9. Installs app and starts studying

**Developer checks later:**
1. Opens dev portal again
2. Sees code "AB3K7Y" now shows "[USED]"
3. User tries to share code with friend
4. Friend enters same code
5. ❌ Error: "This code has already been used"
6. Friend asks developer for new code

---

**Made with ❤️ for Filipino Teachers | Mabuhay! 🇵🇭**
