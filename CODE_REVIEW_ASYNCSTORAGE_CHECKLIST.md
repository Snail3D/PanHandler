# Code Review Checklist - AsyncStorage Performance

## 🔴 MANDATORY CHECKS FOR EVERY PR 🔴

Before approving any PR, run these checks:

---

## 1. Search for AsyncStorage in Gesture Callbacks

```bash
# In the PR branch, run these commands:

# Check for AsyncStorage writes in transform callbacks
rg "onTransformChange" -A 10 | grep -i "set.*State\|AsyncStorage"

# Check for AsyncStorage writes in gesture update callbacks  
rg "onUpdate.*event" -A 10 | grep -i "set.*State\|AsyncStorage"

# Check for AsyncStorage writes in responder move handlers
rg "onResponderMove" -A 10 | grep -i "set.*State\|AsyncStorage"

# Check for AsyncStorage writes in animated reactions
rg "useAnimatedReaction" -A 15 | grep -i "set.*State\|AsyncStorage"
```

**If any of these show AsyncStorage writes WITHOUT debouncing:**
- ❌ **REJECT THE PR**
- ❌ **DO NOT MERGE**
- ⚠️ **Request changes with link to NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md**

---

## 2. Check for High-Frequency State Updates

Look for these patterns in gesture callbacks:

```typescript
// ❌ DANGEROUS PATTERNS
onTransformChange={(data) => {
  setSavedState(data);           // No debounce
  useStore.getState().setSaved(data); // No debounce
  AsyncStorage.setItem(key, data);    // Direct write
}}

onUpdate={(event) => {
  setSomePersistedState(event.x); // No debounce
}}

// ✅ SAFE PATTERNS  
onTransformChange={(data) => {
  setLocalState(data);  // ✅ Local state OK
  
  if (timeout.current) clearTimeout(timeout.current);
  timeout.current = setTimeout(() => {
    setSavedState(data); // ✅ Debounced
  }, 500);
}}
```

---

## 3. Manual Testing (REQUIRED)

**Every PR that touches gesture handling MUST pass this test:**

### Test Procedure
1. Check out the PR branch
2. Run the app on a physical device (not simulator - gestures behave differently)
3. Navigate to measurement screen
4. **Pan image aggressively for 5 seconds** (fast, continuous movement)
5. **IMMEDIATELY tap the Pan/Measure toggle button**
6. **Measure response time with stopwatch**

### Pass Criteria
- ✅ Button responds in **< 200ms**
- ✅ No visual lag or delay
- ✅ No "stuck" or queued touches

### Fail Criteria
- ❌ Button takes **> 200ms** to respond
- ❌ Multiple taps execute at once after delay
- ❌ App feels sluggish or frozen

**If test FAILS:**
- ❌ **REJECT THE PR IMMEDIATELY**
- ⚠️ **Link to NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md**
- ⚠️ **Request debouncing fix**

---

## 4. Check Zustand Store Persist Configuration

Look for new Zustand stores or store modifications:

```typescript
// Check if new state is persisted
const useStore = create<Store>()(
  persist(
    (set) => ({
      newField: value,
      setNewField: (val) => set({ newField: val }), // ← Will write to AsyncStorage
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => AsyncStorage), // ← Persists to AsyncStorage
      partialize: (state) => ({ 
        newField: state.newField, // ← This field will write to AsyncStorage
      }),
    }
  )
);
```

**If you see new persisted fields:**
1. ✅ Verify they're NOT updated in gesture callbacks
2. ✅ Verify they're NOT updated more than once per second
3. ✅ Verify they use debouncing if updated frequently

---

## 5. Check for setTimeout/setInterval with setState

Look for patterns like:

```typescript
// ❌ DANGEROUS
setInterval(() => {
  setSavedState(currentValue); // Writes every interval
}, 100); // 10 times per second = bad

// ✅ SAFE
setInterval(() => {
  setLocalState(currentValue); // Local only
}, 100);

// Save separately with debounce
useEffect(() => {
  const timeout = setTimeout(() => {
    setSavedState(localState);
  }, 1000);
  return () => clearTimeout(timeout);
}, [localState]);
```

---

## 6. Performance Regression Tests

### Automated Performance Test
```typescript
// Add this to your test suite
describe('AsyncStorage Performance', () => {
  it('should not write to AsyncStorage more than once per second', async () => {
    const writeCount = 0;
    const originalSetItem = AsyncStorage.setItem;
    
    AsyncStorage.setItem = jest.fn(async (key, value) => {
      writeCount++;
      return originalSetItem(key, value);
    });
    
    // Simulate 3 seconds of gesture
    for (let i = 0; i < 180; i++) { // 60fps * 3 seconds
      fireEvent(gesture, 'onUpdate', { translationX: i });
      await waitFor(() => {}, { timeout: 16 }); // ~60fps
    }
    
    // Should write at most 2-3 times (initial + debounced + final)
    expect(writeCount).toBeLessThan(5);
    
    AsyncStorage.setItem = originalSetItem;
  });
});
```

---

## 7. Documentation Check

**If PR modifies gesture handlers or adds AsyncStorage writes:**

✅ Verify PR description mentions performance considerations  
✅ Verify code has comments explaining debouncing  
✅ Verify any new patterns follow NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md

---

## 8. Red Flags - Auto-Reject Patterns

**Immediately reject PR if you see:**

```typescript
// ❌ RED FLAG 1: Direct AsyncStorage in gesture callback
onUpdate={(event) => {
  AsyncStorage.setItem('key', event.x);
}}

// ❌ RED FLAG 2: Store setter in gesture callback without debounce
onTransformChange={(scale, x, y) => {
  setSavedZoomState({ scale, x, y }); // Direct store update
}}

// ❌ RED FLAG 3: Zustand persist state in gesture callback
onUpdate={(event) => {
  useStore.getState().setPersisted(event.data); // Writes to AsyncStorage
}}

// ❌ RED FLAG 4: High-frequency interval with persist
setInterval(() => {
  setSavedState(value); // Every 100ms
}, 100);

// ❌ RED FLAG 5: No debounce timeout clear
onTransformChange={(data) => {
  setTimeout(() => setSaved(data), 500); // Missing clear - creates hundreds of timeouts!
}}
```

---

## Summary

### Before Approving PR:
1. ✅ Run automated search commands
2. ✅ Check for dangerous patterns
3. ✅ Perform manual gesture performance test
4. ✅ Verify < 200ms button response after panning
5. ✅ Check Zustand persist configuration
6. ✅ Look for red flag patterns

### If ANY test fails:
- ❌ **DO NOT MERGE**
- ⚠️ **Request changes**
- 📄 **Link to NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md**

---

**The incident of Oct 16, 2025 must never happen again.**

**When in doubt, test it manually. Pan aggressively, tap immediately, time the response.**

**If it takes more than 200ms, it's broken.**
