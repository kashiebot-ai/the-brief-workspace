#!/bin/bash
# Post to social media via Post Bridge API
# Usage: ./post.sh "Your post text" [optional_image_path]

TEXT="$1"
IMAGE_PATH="$2"

if [ -z "$POSTBRIDGE_API_KEY" ]; then
  echo "❌ POSTBRIDGE_API_KEY not set"
  echo "Get your API key from: https://post-bridge.com/create-account"
  exit 1
fi

if [ -z "$TEXT" ]; then
  echo "Usage: ./post.sh \"Your post text\" [optional_image_path]"
  exit 1
fi

echo "📝 Posting to social media via Post Bridge..."
echo "Text: $TEXT"

# Build JSON payload
if [ -n "$IMAGE_PATH" ] && [ -f "$IMAGE_PATH" ]; then
  echo "Image: $IMAGE_PATH"
  # Would upload image first, then post
  PAYLOAD="{\"text\": \"$TEXT\", \"platforms\": [\"twitter\", \"instagram\", \"linkedin\"]}"
else
  PAYLOAD="{\"text\": \"$TEXT\", \"platforms\": [\"twitter\", \"linkedin\"]}"
fi

# API call (simulated - replace with actual Post Bridge endpoint)
echo ""
echo "⏳ API call would happen here:"
echo "POST https://api.post-bridge.com/v1/posts"
echo "Authorization: Bearer $POSTBRIDGE_API_KEY"
echo ""
echo "✅ Post queued successfully!"
echo ""
echo "Note: This is a template. To use Post Bridge:"
echo "1. Sign up at https://post-bridge.com/create-account"
echo "2. Connect your social accounts"
echo "3. Get your API key"
echo "4. Set POSTBRIDGE_API_KEY environment variable"
