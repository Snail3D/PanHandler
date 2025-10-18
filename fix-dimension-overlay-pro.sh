#!/bin/bash

# Replace isProUser checks with true (unlock everything)
sed -i 's/if (!isProUser)/if (false) \/\/ FREEHAND NOW FREE/g' src/components/DimensionOverlay.tsx
sed -i 's/if (isProUser)/if (true) \/\/ FREEHAND NOW FREE/g' src/components/DimensionOverlay.tsx
sed -i 's/!isProUser &&/true \&\&/g' src/components/DimensionOverlay.tsx
sed -i 's/isProUser &&/true \&\&/g' src/components/DimensionOverlay.tsx

# Remove freehand trial checks - make it always pass
sed -i 's/freehandTrialUsed < freehandTrialLimit/true/g' src/components/DimensionOverlay.tsx
sed -i 's/freehandTrialUsed >= freehandTrialLimit/false/g' src/components/DimensionOverlay.tsx

echo "DimensionOverlay Pro checks removed!"
