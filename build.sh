# set the environment value to "prod"
sed -i "s/const currentEnvironment = Environment.DEV;/const currentEnvironment = Environment.PROD;/g" config.js

# create the build
npx electron-builder build --linux

# set the environment value back to "dev"
sed -i "s/const currentEnvironment = Environment.PROD;/const currentEnvironment = Environment.DEV;/g" config.js

# create the target dir and copy the build artifact there
mkdir -p ~/apps/todo_app
cp -r ./dist/linux-unpacked/* ~/apps/todo_app