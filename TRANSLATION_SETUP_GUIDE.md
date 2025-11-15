# PanHandler Internationalization Setup Guide

## 🌍 Overview
Complete translation system for 22 languages with auto-detection and language switching.

## 📋 Setup Steps

### 1. Get Google Cloud Translation API Key (5 minutes)

1. Go to: https://console.cloud.google.com/
2. Create account (includes $300 free credit - more than enough!)
3. Create a new project (e.g., "PanHandler Translations")
4. Enable "Cloud Translation API":
   - Search for "Cloud Translation API"
   - Click "Enable"
5. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

### 2. Install Translation Package

```bash
npm install @google-cloud/translate
```

### 3. Run Batch Translation

**Option A: Set environment variable**
```bash
export GOOGLE_TRANSLATE_API_KEY="your-api-key-here"
node batch-translate-app.js
```

**Option B: Edit the file**
Open `batch-translate-app.js` and set:
```javascript
const API_KEY = 'your-api-key-here';
```

Then run:
```bash
node batch-translate-app.js
```

### 4. What Gets Translated

The script will translate **all app content** to 22 languages:

#### **Languages (22):**
1. English (default) 🇺🇸
2. Spanish 🇪🇸
3. Chinese 🇨🇳
4. Hindi 🇮🇳
5. French 🇫🇷
6. Arabic 🇸🇦
7. Bengali 🇧🇩
8. Russian 🇷🇺
9. Portuguese 🇵🇹
10. Urdu 🇵🇰
11. Indonesian 🇮🇩
12. German 🇩🇪
13. Japanese 🇯🇵
14. Polish 🇵🇱
15. Greek 🇬🇷
16. Swahili 🇰🇪
17. Marathi 🇮🇳
18. Telugu 🇮🇳
19. Turkish 🇹🇷
20. Korean 🇰🇷
21. Tamil 🇮🇳
22. Vietnamese 🇻🇳

#### **What Gets Translated (~1,500 strings):**
- All button labels
- All screen instructions
- All tooltips and helper text
- HelpModal complete content
- PDF guide content
- BattlingBots conversations
- Alert messages
- 200 quotes per language (20% biblical)
- Chuck Norris jokes (localized)

#### **What Stays in English:**
- Code/variable names
- File paths
- Technical terms (when quoted in instructions)

### 5. Features

✅ **Auto-Language Detection**
- Detects device system language on first launch
- Automatically switches to user's language if supported
- Falls back to English if language not supported

✅ **Default Coin by Language**
- Each language pre-selects relevant local coin
- Example: Swahili → Kenyan Shilling
- Example: Japanese → 500 Yen

✅ **Language Switcher**
- Bottom of HelpModal: compact language selector
- Click any language → switches entire app
- Preference saved for next time

✅ **PDF in Selected Language**
- PDF generates in whatever language user selected
- Region-appropriate coin examples
- QR codes stay the same

## 💰 Cost Estimate

**Google Cloud Translation API:**
- ~1,500 strings × 21 languages × ~50 characters average
- = ~1.5 million characters
- Cost: **~$30** (well within free $300 credit!)

## 🚀 After Translation

Once translation completes:

1. **Update i18n imports** in `src/utils/i18n.ts`
2. **Update language selector** in HelpModal with all 22 languages
3. **Test language switching**
4. **Build and deploy**

## 📝 Translation Quality

For best results:
- Review automated translations
- Have native speakers verify key terms
- Adjust button text for natural phrasing

## 🔧 Technical Files

**Created:**
- `src/utils/i18n.ts` - i18n configuration
- `src/utils/translations/en.json` - Master English template
- `batch-translate-app.js` - Automated translation script
- `src/utils/translations/*.json` - All language files (after running script)

**Need to Update After Translation:**
- All components to use `useTranslation()` hook
- Import all translation files in i18n.ts
- Add language switcher UI

## 🎯 Next Steps

1. Get your Google Cloud API key
2. Run `batch-translate-app.js`
3. Let me integrate translations into all components
4. Test and launch!

**This will make PanHandler accessible to 4+ billion people! 🌍**

