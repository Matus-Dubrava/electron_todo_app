grep -rl "const environment = 'dev';" ./index.js | xargs sed -i "s/const environment = 'dev';/const environment = 'prod';/g"
npx electron-builder build --linux
grep -rl "const environment = 'prod';" ./index.js | xargs sed -i "s/const environment = 'prod';/const environment = 'dev';/g"
mkdir -p ~/apps/todo_app
cp -r ./dist/linux-unpacked/* ~/apps/todo_app