#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use v10.15.3
#npm run-script build --prod --output-hashing=all
#ng build --prod
ng build
#ng build --base-href=/sign-hub/
cp .htaccess ./dist/sign-hub/
