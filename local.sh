echo 'Installing dependencies...';
npm run install-ci

echo 'Building...';
npx prebuildify --napi --tag-libc
npx tsc
mv -vn ./dist/* ./
rm -rf dist