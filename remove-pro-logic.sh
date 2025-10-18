#!/bin/bash
# Backup original file
cp src/components/DimensionOverlay.tsx src/components/DimensionOverlay.tsx.backup

# Remove all Pro checking logic - make freehand always available
sed -i 's/if (!isProUser) {/if (false) { \/\/ PRO REMOVED - Always allow/' src/components/DimensionOverlay.tsx
sed -i 's/if (isProUser) {/if (true) { \/\/ PRO REMOVED - Always treat as unlocked/' src/components/DimensionOverlay.tsx
sed -i 's/&& !isProUser//g' src/components/DimensionOverlay.tsx
sed -i 's/!isProUser &&//g' src/components/DimensionOverlay.tsx
sed -i 's/freehandTrialUsed >= freehandTrialLimit/false \/\/ TRIAL REMOVED/' src/components/DimensionOverlay.tsx
sed -i 's/freehandTrialUsed < freehandTrialLimit/true \/\/ TRIAL REMOVED/' src/components/DimensionOverlay.tsx

echo "Pro logic removal complete!"
