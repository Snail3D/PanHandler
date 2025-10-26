# CAD File Format Research 📐

## Common Formats with Embedded Dimensions

### 1. **DXF (Drawing Exchange Format)** ⭐ Most Common
- **Used by:** AutoCAD, all major CAD software
- **Contains:** Lines, polylines, dimensions, text, layers
- **Readability:** Text-based (ASCII), easy to parse
- **Size:** Medium
- **Support:** Universal standard

### 2. **DWG (AutoCAD Drawing)**
- **Used by:** AutoCAD (native format)
- **Contains:** Complete CAD data, dimensions, 3D models
- **Readability:** Binary (harder to parse, need library)
- **Size:** Smaller than DXF
- **Support:** Industry standard

### 3. **SVG (Scalable Vector Graphics)** ⭐ Web Standard
- **Used by:** Illustrator, Inkscape, web browsers
- **Contains:** Vector paths, dimensions, text, metadata
- **Readability:** XML-based (very easy to parse!)
- **Size:** Small
- **Support:** Universal, native web format

### 4. **PDF (with vector data)**
- **Used by:** Everywhere
- **Contains:** Vector graphics, dimensions, annotations
- **Readability:** Complex (need library)
- **Size:** Varies
- **Support:** Universal

### 5. **STEP / STP (ISO 10303)**
- **Used by:** 3D CAD (SolidWorks, CATIA, etc.)
- **Contains:** 3D models, surfaces, dimensions
- **Readability:** Text-based
- **Size:** Large
- **Support:** 3D engineering standard

### 6. **IGES (Initial Graphics Exchange)**
- **Used by:** 3D CAD (older standard)
- **Contains:** 3D wireframes, surfaces
- **Readability:** Text-based
- **Size:** Large
- **Support:** Legacy but still used

---

## Best Candidates for Your App

### Tier 1: Easy to Implement ✅
1. **DXF** - Text-based, parseable in JavaScript
2. **SVG** - XML, native browser support
3. **GeoJSON** - For maps/surveys with coordinates

### Tier 2: Medium Difficulty 🟡
4. **PDF** - Need library (pdf-lib, react-native-pdf)
5. **KML/KMZ** - Google Earth files with coordinates

### Tier 3: Complex 🔴
6. **DWG** - Proprietary binary (need native library)
7. **STEP/IGES** - 3D files (heavy parsing)

---

## Implementation Strategy

### Phase 1: SVG Support (Easiest) ⚡
**Why:** XML-based, easy parsing, already supported in React Native
**Use Case:** Architects export floor plans as SVG with dimensions
**Parse:** Extract `<path>`, `<line>`, `<text>` elements
**Auto-detect:** Look for dimension text near lines

### Phase 2: DXF Support (Most Useful) 🎯
**Why:** Industry standard for CAD
**Use Case:** Contractors import AutoCAD drawings
**Parse:** Read ASCII DXF, extract DIMENSION entities
**Library:** `dxf-parser` (JavaScript)

### Phase 3: GeoJSON (Surveyors) 🗺️
**Why:** Standard for mapping/surveying
**Use Case:** Land surveyors import property boundaries
**Parse:** Native JSON parsing
**Auto-detect:** Convert lat/lon to distances

---

## Example DXF Structure

```dxf
0
SECTION
2
ENTITIES
0
LINE
8
Dimensions
10
0.0
20
0.0
11
100.0
21
0.0
0
DIMENSION
2
*D1
10
50.0
20
-5.0
13
0.0
23
0.0
14
100.0
24
0.0
1
100.0
```

**Contains:**
- Layer name ("Dimensions")
- Start point (0, 0)
- End point (100, 0)
- Dimension value: 100.0 units

---

## Example SVG Structure

```svg
<svg width="500" height="500">
  <!-- Line -->
  <line x1="0" y1="100" x2="400" y2="100" 
        stroke="black" stroke-width="2"/>
  
  <!-- Dimension text -->
  <text x="200" y="90" text-anchor="middle">
    400mm
  </text>
  
  <!-- Dimension arrows -->
  <path d="M 0 100 L 10 95 L 10 105 Z"/>
  <path d="M 400 100 L 390 95 L 390 105 Z"/>
</svg>
```

**Parse Strategy:**
1. Find lines with nearby text
2. Extract distance from text ("400mm")
3. Calculate pixels per unit
4. Auto-calibrate!

---

## Proposed Feature Flow

### User Experience:
```
1. Tap "Import"
   ↓
2. Select DXF/SVG/PDF file
   ↓
3. App detects file type
   ↓
4. "📐 CAD File Detected"
   ↓
5. Parse dimensions automatically
   ↓
6. Show preview with detected measurements
   ↓
7. "Use these dimensions?" [Yes] [No]
   ↓
8. Auto-calibrate → Measurement mode!
```

### Auto-Detection Logic:
```typescript
if (file.endsWith('.dxf')) {
  // Parse DXF, extract DIMENSION entities
  const dimensions = parseDXF(file);
  autoCalibrate(dimensions);
} else if (file.endsWith('.svg')) {
  // Parse SVG, extract text + lines
  const dimensions = parseSVG(file);
  autoCalibrate(dimensions);
} else if (file.endsWith('.pdf')) {
  // Extract vector data
  const dimensions = parsePDF(file);
  autoCalibrate(dimensions);
}
```

---

## Use Cases

### 1. Construction Contractor
- **Has:** AutoCAD floor plan (DXF)
- **Wants:** Measure room dimensions on-site
- **Flow:** Import DXF → Auto-calibrate from drawing → Verify on-site

### 2. Architect
- **Has:** Illustrator drawing (SVG)
- **Wants:** Check if built matches design
- **Flow:** Import SVG → Compare to photo → Find discrepancies

### 3. Land Surveyor
- **Has:** Survey map (GeoJSON/DXF)
- **Wants:** Overlay on satellite image
- **Flow:** Import survey → Auto-scale → Overlay on map

### 4. Home Inspector
- **Has:** Blueprint PDF
- **Wants:** Annotate findings
- **Flow:** Import PDF → Extract dimensions → Add measurements

---

## Libraries to Use

### JavaScript (React Native compatible):

1. **DXF Parsing:**
   ```bash
   npm install dxf-parser
   ```
   - Pure JavaScript ✅
   - React Native compatible ✅
   - Parses ASCII DXF files

2. **SVG Parsing:**
   ```bash
   npm install react-native-svg
   ```
   - Already installed in your app! ✅
   - Native SVG rendering
   - Can extract path data

3. **PDF Parsing:**
   ```bash
   npm install react-native-pdf
   npm install pdf-lib
   ```
   - Render PDF pages
   - Extract text/vectors

4. **File Picking:**
   ```bash
   npm install expo-document-picker
   ```
   - Pick any file type
   - Get file URI and metadata

---

## Implementation Priority

### MVP (Minimum Viable Product):
1. ✅ **SVG Support** - Easy, useful for architects
   - Parse SVG XML
   - Extract lines + text
   - Auto-detect dimensions
   - Time: 2-3 hours

### V2:
2. 🎯 **DXF Support** - Most requested by contractors
   - Use dxf-parser library
   - Extract DIMENSION entities
   - Convert units
   - Time: 4-6 hours

### V3:
3. 🗺️ **GeoJSON Support** - For surveyors
   - Parse JSON
   - Convert coordinates to distances
   - Overlay on map mode
   - Time: 3-4 hours

### Future:
4. 📄 **PDF Support** - Complex but valuable
   - Extract vector data
   - OCR dimension text
   - Time: 8-10 hours

---

## File Type Detection

```typescript
const detectFileType = (uri: string) => {
  const ext = uri.toLowerCase().split('.').pop();
  
  switch(ext) {
    case 'dxf': return 'autocad';
    case 'svg': return 'svg';
    case 'pdf': return 'pdf';
    case 'dwg': return 'autocad-binary';
    case 'geojson':
    case 'json': return 'geojson';
    case 'kml':
    case 'kmz': return 'google-earth';
    default: return 'image';
  }
};
```

---

## UI/UX Considerations

### File Import Button:
```
[📷 Camera] [🖼️ Photo] [📐 CAD File]
```

### Detection Modal:
```
┌─────────────────────────────┐
│   📐 Floor Plan Detected    │
├─────────────────────────────┤
│ Found 12 dimensions:        │
│                             │
│ • Room Width: 4.5m          │
│ • Room Length: 6.2m         │
│ • Window: 1.8m              │
│ • Door: 0.9m                │
│ • ...and 8 more             │
│                             │
│ Use these for calibration?  │
│                             │
│ [Cancel] [Use Dimensions]   │
└─────────────────────────────┘
```

---

## Next Steps

1. **Fix drone detection first** (current priority)
2. **Implement SVG support** (easiest win)
3. **Add DXF support** (most requested)
4. **Test with real CAD files** from users

---

## Questions for You

1. **Which format is most important to you?**
   - DXF (AutoCAD)?
   - SVG (Illustrator)?
   - PDF (blueprints)?

2. **Do you have sample files I can test with?**
   - Help me ensure parsing works correctly

3. **What's the typical use case?**
   - Verify built vs. designed?
   - On-site measurements?
   - Documentation?

---

**Status:** Research complete, ready to implement once drone detection is fixed! 🚀
