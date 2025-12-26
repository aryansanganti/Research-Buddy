#!/bin/sh

# Create env-config.js file
cat <<EOF > /usr/share/nginx/html/env-config.js
window.env = {
  VITE_GEMINI_API_KEY: "${VITE_GEMINI_API_KEY}",
};
EOF

# Start Nginx
exec "$@"
