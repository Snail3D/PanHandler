# Help Modal - CAD Workflow Text Update

## Date: October 13, 2025

## Change

Removed mentions of "alignment brackets" (feature not included) and simplified text to focus on "50% opacity for easy tracing".

---

## What Was Changed

### 1. **Save & Share Section** (Line 875)

**Before:**
```
🔧 CAD Export - 50% opacity with alignment brackets
```

**After:**
```
🔧 CAD Export - 50% opacity for easy tracing
```

---

### 2. **CAD Import Guide - Step 3** (Lines 1087-1091)

**Before:**
```
Quick Scaling: The photo label shows your coin type and size...

Alignment Brackets: The 50% opacity image includes corner 
alignment brackets to make positioning in CAD quick and easy
```

**After:**
```
Quick Scaling: The photo label shows your coin type and size...

(Alignment Brackets section removed entirely)
```

---

### 3. **CAD Import Guide - Step 4** (Line 1106)

**Before:**
```
Trace over the 50% opacity image using your CAD tools. 
Use the alignment brackets to position the image precisely!
```

**After:**
```
Trace over the 50% opacity image using your CAD tools 
for easy reference!
```

---

## Why This Change?

**User Feedback:** "get rid of the text about the brackets the brackets aren't included"

The alignment brackets feature was mentioned in the documentation but isn't actually included in the exported photos, so the text was misleading and needed to be removed.

---

## Updated CAD Import Guide

### Step 3: Scale Using Coin Reference
- **Focus:** Use coin information from label to scale canvas
- **What's shown:** Just the quick scaling tip
- **Removed:** Alignment brackets mention

### Step 4: Trace & Model  
- **Focus:** Trace over 50% opacity image
- **Simplified:** "for easy reference" instead of bracket positioning
- **Clearer:** Less confusing without non-existent feature

---

## Files Modified

**`/home/user/workspace/src/components/HelpModal.tsx`**

**Lines Changed:**
- 875: Save & Share CAD Export description
- 1087-1091: CAD Import Guide Step 3 (removed alignment brackets section)
- 1106: CAD Import Guide Step 4 (simplified text)

---

## Impact

### Before
- ❌ Mentioned alignment brackets (feature doesn't exist)
- ❌ Confusing for users looking for brackets
- ❌ Three different places mentioning non-existent feature

### After
- ✅ Accurate description: "50% opacity for easy tracing"
- ✅ No mention of non-existent brackets
- ✅ Simpler, clearer instructions
- ✅ Focuses on what actually exists

---

## Complete Updated Text

### Save & Share Section:
```
📸 Labeled Photo - All measurements shown
🔧 CAD Export - 50% opacity for easy tracing
📄 Reference Photo - Clean with scale info
✉️ Email Reports - All photos + data
```

### CAD Import Guide:
```
Step 3: Scale Using Coin Reference
  Use the coin information in the photo label to quickly 
  scale your canvas in CAD
  
  Quick Scaling: The photo label shows your coin type and 
  size (e.g., "US Quarter - Ø 24.26mm"). Use this to set 
  your canvas scale by measuring the coin in the photo!

Step 4: Trace & Model
  Trace over the 50% opacity image using your CAD tools 
  for easy reference!
```

---

## User Experience

### What Users Get:
1. **50% opacity photo** - Makes tracing easy in CAD
2. **Coin reference info** - For scaling the canvas
3. **Clear instructions** - No confusing bracket references

### What Was Removed:
- ❌ Alignment brackets mention (3 places)
- ❌ Positioning instructions for non-existent brackets
- ❌ Confusing expectations

---

## Version Information

**Updated In:** v1.1 Stable + CAD Workflow Text Fix  
**Status:** ✅ Complete  
**Impact:** Documentation accuracy improvement  

---

*Last updated: October 13, 2025*  
*User feedback: "brackets aren't included"*  
*Fixed by: Removing all bracket references*  
*Status: ✅ Accurate documentation*
