# Cache Management Guide

## Quick Cache Clear

If you encounter TypeScript errors, stale imports, or unexpected behavior after making code changes, clear the cache:

```bash
bun run clear-cache
```

This command will:
1. Remove Expo cache directories (`.expo/web-cache`, `.expo/metro-cache`, `.expo/typed-routes`)
2. Remove node_modules cache
3. Restart the development server with `--clear` flag

## Manual Cache Clearing

If the above doesn't resolve the issue, try these additional steps:

### 1. Full Cache Reset
```bash
# Clear all caches
rm -rf .expo node_modules/.cache

# Clear Metro bundler cache (if watchman is installed)
watchman watch-del-all

# Reinstall dependencies
bun install

# Start with clean cache
bun run clear-cache
```

### 2. TypeScript Cache Issues
If you see persistent TypeScript errors that don't make sense:
```bash
# Touch the affected files to invalidate cache
touch src/components/YourComponent.tsx

# Or restart TypeScript server in your editor
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### 3. React Native/Expo Cache
```bash
# Clear Expo cache globally
expo start -c

# Or use the clear-cache script
bun run clear-cache
```

## Common Cache Issues

### Stale TypeScript Errors
**Symptoms**: TypeScript shows errors for code that is correct, or errors about types that exist.

**Solution**: 
- Touch the file: `touch src/components/YourFile.tsx`
- Restart TS server in your editor
- Run `bun run clear-cache`

### Metro Bundler Issues
**Symptoms**: "Unable to resolve module", bundler hangs, or stale imports.

**Solution**:
- Run `bun run clear-cache`
- Restart the Expo dev server

### Build/Transform Issues
**Symptoms**: Code changes not reflected in app, old code still running.

**Solution**:
- Force reload in Expo Go (shake device → Reload)
- Run `bun run clear-cache`

## Prevention Tips

1. **After large refactors**: Run `bun run clear-cache` to ensure clean state
2. **After dependency updates**: Clear cache and reinstall
3. **Before troubleshooting**: Clear cache first to rule out cache issues
4. **CI/CD**: Always use `--clear` flag in automated builds

## Cache Locations

The following directories store cached data:
- `.expo/` - Expo build and Metro bundler cache
- `node_modules/.cache/` - Various package caches
- `/tmp/metro-*` - Metro bundler temp files (system-wide)
- `/tmp/react-*` - React Native temp files (system-wide)
- `/tmp/haste-*` - Haste map cache (system-wide)

## Editor-Specific Cache

### VS Code
- TypeScript: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- ESLint: `Cmd+Shift+P` → "ESLint: Restart ESLint Server"

### IntelliJ/WebStorm
- File → Invalidate Caches → Invalidate and Restart

## When Cache Clearing Doesn't Help

If clearing cache doesn't resolve your issue:
1. Check for actual code errors (not cache)
2. Verify dependencies are installed correctly
3. Check for conflicting package versions
4. Review recent code changes for syntax errors
5. Check the Metro bundler logs for specific errors

## Automated Cache Management

The `clear-cache` script is automatically configured in `package.json` and will:
- Clear all relevant cache directories
- Force Metro to rebuild from scratch
- Ensure fresh TypeScript compilation

This is the recommended first step when troubleshooting any development issues.
