#!/bin/bash

# uncomment for debug info
# set -x

# Get correct version of node
if [[ ! -f ~/.nvm/nvm.sh ]]
then
  read -r -p "Install nvm and switch to node 16? [y/N] " response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
  then
    curl https://raw.github.com/creationix/nvm/master/install.sh | sh
    . ~/.nvm/nvm.sh
    . ~/.profile
    . ~/.bashrc
    nvm install 16
    echo "Node version: $(node --version)"
  else
    exit 0
  fi
fi

# clone pwc and fs
git clone https://github.com/PrismarineJS/flying-squid.git
git clone https://github.com/PrismarineJS/prismarine-web-client.git

# move the HEAD back to an older version of pwc
cd prismarine-web-client
git reset --hard 9e53633286f7824bc12ef2aa75cf7bfc59bb6e06 
cd ..

# copy patch files
cp ./patch-files/fs.js ./flying-squid/
cp -r ./patch-files/orthogen/ ./flying-squid/node_modules/

# install fs and pwc
cd prismarine-web-client
npm install
cd ../flying-squid
npm install
cd ..

echo "In one terminal run: cd flying-squid && node fs.js"
echo "In a second terminal run: cd prismarine-web-client && npm start"








