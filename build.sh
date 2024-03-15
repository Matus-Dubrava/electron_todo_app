##############################################################################
# cli                                                                        #
# build the python dependency                                                #   
# this is purely for testing purposes                                        #
##############################################################################
# clean the existing build folder
rm -rf ./build
# produce executable from python script
# --onefile option tells pyinstaller to statically link all dependencies
pyinstaller --onefile cli.py

##############################################################################
# Electron app                                                               #
##############################################################################

# set the environment value to "prod"
sed -i "s/const currentEnvironment = Environment.DEV;/const currentEnvironment = Environment.PROD;/g" config.js

# create the build
npx electron-builder build --linux

# set the environment value back to "dev"
sed -i "s/const currentEnvironment = Environment.PROD;/const currentEnvironment = Environment.DEV;/g" config.js

# create the target dir and copy the build artifact there
mkdir -p ~/apps/todo_app
cp -r ./dist/linux-unpacked/* ~/apps/todo_app
cp ./dist/cli ~/apps/todo_app/cli

##############################################################################
# clean up                                                                   #
##############################################################################
rm -rf ./build/*
mv ./dist/cli ./build
mv ./cli.spec ./build