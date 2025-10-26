# 🔴 CRITICAL PERFORMANCE RULE - README FIRST 🔴

## ⚠️ NEVER WRITE TO ASYNCSTORAGE DURING GESTURES ⚠️

**If you violate this rule, the app will freeze for 10-15 seconds.**

See: `NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md` for complete documentation.

---

## Quick Reference

### ❌ NEVER DO THIS
```typescript
onTransformChange={(data) => {
  setSavedState(data); // ☠️ Writes to AsyncStorage every frame
}}
```

### ✅ ALWAYS DO THIS
```typescript
const saveTimeout = useRef<NodeJS.Timeout | null>(null);

onTransformChange={(data) => {
  setLocalState(data); // ✅ Fast
  
  if (saveTimeout.current) clearTimeout(saveTimeout.current);
  saveTimeout.current = setTimeout(() => {
    setSavedState(data); // ✅ Debounced
  }, 500);
}}
```

---

## The Incident (Oct 16, 2025)

**Bug**: Buttons locked up for 10-15 seconds after panning  
**Cause**: `onTransformChange` wrote to AsyncStorage 60+ times/second  
**Impact**: App was completely unusable  
**Fix**: Debounced AsyncStorage writes to once per 500ms  
**Files Modified**: `src/screens/MeasurementScreen.tsx` (Lines 89, 935-946)

---

## Testing Rule

**Before every commit that touches AsyncStorage:**

1. Pan aggressively for 5 seconds
2. IMMEDIATELY tap a button
3. Button MUST respond within 100ms

**If it takes >200ms, YOU BROKE IT.**

---

See full documentation: `NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md`
