docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDdgngT2YKtd1jyAloNqFLFRTNr9aty6zA \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=handi-62f09.firebaseapp.com \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=handi-62f09 \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=handi-62f09.firebasestorage.app \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=657064704852 \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=1:657064704852:web:269f87d273bc06dff3e6c1 \
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TMT9VT26P5 \
  -t australia-southeast2-docker.pkg.dev/handi-62f09/handi-frontend/handi-gpt-minimal:latest . 