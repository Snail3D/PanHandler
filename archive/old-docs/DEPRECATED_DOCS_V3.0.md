# ⚠️ DEPRECATED DOCUMENTATION

**This document is DEPRECATED as of v3.5.0 (October 20, 2025)**

The information in this file is **outdated and should not be referenced**.

---

## Why This Was Deprecated

v3.5.0 represents a complete rewrite of the photo capture system. All the issues, fixes, and workarounds described in v3.0.x documents are no longer relevant because the underlying code was completely replaced.

---

## What to Read Instead

📖 **Current Documentation**: `VERSION_3.5_STABLE.md`

This is the single source of truth for v3.5+ and contains:
- Complete system overview
- Simplified architecture
- Current bug status (all fixed)
- Testing protocols
- Maintenance guidelines

---

## Deprecated Files List

These files describe problems and solutions that no longer exist in v3.5:

### v3.0.3 Era
- `MMKV_BLOCKING_COMPLETE_REMOVAL_V3.0.3.md`
- `MMKV_AUTO_CLEAR_V3.0.3.md`
- `FINGER_CIRCLES_REMOVED_V3.0.2.md`
- `PINCH_TUTORIAL_REMOVED_V3.0.2.md`

### v3.0.4-3.0.6 Era  
- `FRESH_INSTALL_FLASH_BUG_FIX_V3.0.4.md`
- `DOUBLE_CAPTURE_BUTTON_FIX_V3.0.5.md`
- `COIN_NAME_TAP_FIX_V3.0.6.md`

### v3.0.7-3.0.8 Era (The Crisis)
- `CRITICAL_LOCKUP_BUG_FIX_V3.0.7.md`
- `APP_CRASH_INVESTIGATION_V3.0.8.md`
- `SIMPLE_PHOTO_CAPTURE_FIX.md` (superseded by actual implementation)

### Other Outdated Docs
- `SESSION_COMPLETE_OCT18_IMAGE_UNMOUNTING_FIX.md`
- `PHOTO_FLOW_AND_CRITICAL_RULES.md` (rules changed in v3.5)
- Any doc mentioning "safety timeouts"
- Any doc mentioning "nested setTimeout chains"
- Any doc describing animation orchestration

---

## If You're Debugging v3.5+

**DON'T** reference these old documents. The code they describe **no longer exists**.

**DO** reference:
1. `VERSION_3.5_STABLE.md` - System overview
2. `SESSION_COMPLETE_WORKING_VERSION.md` - What changed and why
3. The actual source code - It's now simple enough to read directly

---

## Historical Value

These documents are kept for historical reference only:
- Understanding what problems existed in v3.0.x
- Learning what NOT to do (bandaid fixes)
- Appreciating why v3.5 was a complete rewrite

**Do not use them as a guide for current development.**

---

## Red Flags

If you see any documentation or comments mentioning these, they are outdated:

❌ "Safety timeout"  
❌ "Nested setTimeout chains"  
❌ "Clear timeout in all code paths"  
❌ "Wait for component to mount"  
❌ "Orchestrate animation timing"  
❌ "Emergency reset button"  
❌ "Force clear black overlay"  

All of these concepts were **removed** in v3.5.

---

**Last Updated**: October 20, 2025  
**Deprecation Date**: v3.5.0 release  
**Replacement**: VERSION_3.5_STABLE.md
