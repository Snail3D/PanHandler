#!/usr/bin/env python3
import re

file_path = '/home/user/workspace/src/components/DimensionOverlay.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Pattern for Circle button
content = re.sub(
    r"(\{/\* Circle \*/\}\s+<Pressable\s+onPress=\{\(\) => \{)",
    r"{\/* Circle *\/}\n              <Pressable\n                onPress={(event) => {\n                  const { pageX, pageY } = event.nativeEvent;\n                  createMenuFingerprint(pageX, pageY);",
    content,
    count=1
)

# Save
with open(file_path, 'w') as f:
    f.write(content)

print("Done!")
