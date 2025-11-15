# PDF Guide Generation & Distribution

This document explains how PanHandler PDF guides are generated and distributed to users.

---

## 📱 In-App PDF Generation

Users can generate PDF guides directly from within the PanHandler app in any supported language:

**Steps:**
1. Open PanHandler
2. Tap Help (?) icon in top-right
3. Scroll to bottom of Help modal
4. Tap "PDF Guide" button
5. Select desired language from the language selector
6. PDF is generated and ready to download/share

**Languages Supported:** All 30 languages

---

## 📥 Pre-Generated PDF Downloads

Pre-generated PDF guides are available on GitHub Releases for users who prefer to download them without opening the app.

**Location:** [GitHub Releases](https://github.com/Snail3D/PanHandler/releases)

**File Naming:** `PanHandler-Guide-{LANG_CODE}-{Language_Name}.pdf`

**Examples:**
- `PanHandler-Guide-EN-English.pdf`
- `PanHandler-Guide-ES-Espanol.pdf`
- `PanHandler-Guide-ZH-Chinese.pdf`
- `PanHandler-Guide-AR-Arabic.pdf`
- [... 26 more languages ...]

---

## 🔄 How to Generate & Upload Pre-Made PDFs

### Option 1: Browser-Based Generation (Recommended)

1. **Run the HTML generation script:**
   ```bash
   node generate-pdf-guides.js
   ```

2. **Output:** Creates `PDFs/` directory with HTML files
   ```
   PDFs/
   ├── PanHandler-Guide-EN-English.html
   ├── PanHandler-Guide-ES-Espanol.html
   ├── PanHandler-Guide-ZH-Chinese.html
   └── ... (30 total)
   ```

3. **Convert to PDF:** For each HTML file:
   - Open in Chrome/Firefox
   - Right-click → Print
   - Destination: "Save as PDF"
   - Save with same filename but `.pdf` extension

### Option 2: Command-Line Batch Conversion

Using `wkhtmltopdf` (requires installation):

```bash
# Install wkhtmltopdf
brew install wkhtmltopdf  # macOS
# or: apt-get install wkhtmltopdf  # Linux
# or: choco install wkhtmltopdf  # Windows

# Convert all HTML files to PDF
for file in PDFs/*.html; do
  pdf_file="${file%.html}.pdf"
  wkhtmltopdf "$file" "$pdf_file"
done
```

### Option 3: Puppeteer Batch Conversion

```bash
npm install --save-dev puppeteer

# Then create a Node.js script or use existing tools
```

---

## 📤 Uploading to GitHub Releases

1. **Create GitHub Release**
   ```bash
   git tag -a v2.0-pdfs -m "PDF Guides for all 30 languages"
   git push origin v2.0-pdfs
   ```

2. **Go to GitHub:**
   - Navigate to Releases
   - Click "Create a new release"
   - Tag: Select your tag (e.g., `v2.0-pdfs`)
   - Title: "PanHandler PDF Guides - 30 Languages"
   - Description:
     ```
     Complete PDF guides in all 30 supported languages.
     
     **Instructions:**
     1. Download the PDF for your language
     2. Or generate in-app: Help (?) → PDF Guide
     
     **Files included:**
     - English, Spanish, French, German, Portuguese
     - Chinese, Japanese, Korean
     - Hindi, Bengali, Marathi, Tamil, Telugu, Punjabi
     - Arabic, Urdu, Hebrew, Farsi
     - Russian, Polish, Greek, Turkish
     - Indonesian, Vietnamese, Thai, Burmese
     - Swahili, Hausa, Amharic, Filipino
     ```

3. **Upload PDF Files**
   - Drag & drop all 30 PDF files to the release
   - Or use GitHub CLI:
     ```bash
     gh release upload v2.0-pdfs PDFs/*.pdf
     ```

---

## 🔗 README Links

Update `README.md` with working GitHub release links:

```markdown
## 📄 Multilingual PDF Guides (30 Languages!)

Download complete user guides in 30 languages:

- 🇺🇸 **EN** [English](https://github.com/Snail3D/PanHandler/releases/download/v2.0-pdfs/PanHandler-Guide-EN-English.pdf)
- 🇪🇸 **ES** [Español](https://github.com/Snail3D/PanHandler/releases/download/v2.0-pdfs/PanHandler-Guide-ES-Espanol.pdf)
- 🇫🇷 **FR** [Français](https://github.com/Snail3D/PanHandler/releases/download/v2.0-pdfs/PanHandler-Guide-FR-French.pdf)
- 🇨🇳 **ZH** [中文](https://github.com/Snail3D/PanHandler/releases/download/v2.0-pdfs/PanHandler-Guide-ZH-Chinese.pdf)
[... and 26 more ...]

**Or generate from the app:** Tap Help (?) → PDF Guide → Select language
```

---

## 📊 PDF Specifications

- **Format:** PDF (compatible with all devices)
- **Pages:** ~15 pages per language
- **Size:** ~500KB per file
- **Content:** 11 major sections with complete instructions
- **Features:**
  - Fully translated in each language
  - RTL support for Arabic, Hebrew, Urdu, Farsi
  - Professional formatting
  - QR codes and links (in app-generated versions)
  - Region-specific examples

---

## 🛠️ Technical Details

### PDF Translation Keys (56+)
- Title and subtitle
- 11 major sections:
  1. Video Courses
  2. Step 1: Take Perfect Photo
  3. Step 2: Calibrate with Coin
  4. Step 3: Place Measurements
  5. Volume Calculation
  6. Navigation & Controls
  7. Move & Edit
  8. Save & Share
  9. Email Workflow
  10. Advanced Features
  11. Troubleshooting

### Language Support
All translations managed in `src/utils/pdfTranslations.ts`

```typescript
export const translations: Record<string, PDFTranslation> = {
  en: { /* full content */ },
  es: { /* full content */ },
  zh: { /* full content */ },
  // ... 27 more languages
}
```

---

## ✅ PDF Generation Process

```
Generate HTML files
   ↓
Convert to PDF (browser or CLI)
   ↓
Quality check
   ↓
Upload to GitHub Releases
   ↓
Update README with links
   ↓
Users can download or generate in-app
```

---

## 🔄 Maintenance

**When translations are updated:**
1. Update `src/utils/pdfTranslations.ts`
2. Regenerate HTML files: `node generate-pdf-guides.js`
3. Convert to PDF (browser or CLI method)
4. Create new GitHub release
5. Update README with new release links

---

## 📝 File Naming Convention

```
PanHandler-Guide-{CODE}-{Language}.pdf

{CODE} = ISO 639-1 language code (uppercase)
  en, es, fr, de, it, pt, ru, pl, el, tr, ko, ja, zh,
  hi, bn, mr, ta, te, ur, id, vi, th, ar, he, fa, am, my, ha, pa, fil

{Language} = English name of language
  English, Espanol, Francais, Deutsch, etc.
```

---

## 🎯 Goals Achieved

- ✅ PDFs generated in all 30 languages
- ✅ Available for download from GitHub Releases
- ✅ Also available in-app for convenience
- ✅ Professional formatting and translations
- ✅ Easy maintenance and updates

---

## 📞 Questions?

See `INTERNATIONALIZATION_COMPLETE.md` for full i18n details.

