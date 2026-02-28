#!/bin/bash
# Import markdown explainers to Sanity
# Usage: ./import-explainers.sh

echo "📝 Converting markdown to Sanity format..."

# Convert the parliament explainer
npx markdown-to-sanity \
  --input ../projects/the-briefing/content/explainer-how-parliament-works.md \
  --output ./import-data.ndjson \
  --type explainer

# Check if conversion worked
if [ -f "./import-data.ndjson" ]; then
  echo "✅ Conversion complete"
  echo "📤 Importing to Sanity..."
  
  # Import to Sanity using CLI (uses your authenticated session)
  npx sanity dataset import ./import-data.ndjson production
  
  if [ $? -eq 0 ]; then
    echo "✅ Import successful!"
    rm ./import-data.ndjson
  else
    echo "❌ Import failed. Check errors above."
  fi
else
  echo "❌ Conversion failed - no output file created"
fi
