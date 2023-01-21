#!/bin/bash

# commit_message="$1"
# if [ -z "$1" ]; then
# commit_message='...'
# fi
# hg='/Applications/MacHg.app/Contents/Resources/localhg'



echo "Minifying vpass.html, vpass.js into index.html..."
sed -e '/<script/,$d' vpass.html > index.html
echo "<script type=\"text/javascript\">" >> index.html
cat vpass.js >> index.html
echo "</script></body></html>" >> index.html
java -jar ../tools/htmlcompressor.jar --compress-js --compress-css -o index.html index.html


echo "Zipping sources..."
rm vpass.zip
zip -o vpass.zip vpass.html vpass.js

echo "Copying to chrome extension..."
cp vpass.html chrome-extension/vpass/
cp vpass.js chrome-extension/vpass/

echo "Zipping chrome extension..."
rm chrome-extension/vpass.zip
zip -q0 chrome-extension/vpass.zip chrome-extension/vpass/*

echo "Copying to opera extension..."
cp vpass.html opera-extension/vpass/
cp vpass.js opera-extension/vpass/

echo "Zipping opera extension..."
rm opera-extension/vpass.oex
zip -jq0 opera-extension/vpass.oex opera-extension/vpass/*

echo "Copying to safari extension..."
cp vpass.html safari-extension/vpass.safariextension/
cp vpass.js safari-extension/vpass.safariextension/


echo "Updating about page..."
cd about/
php source.php > index.html
php source.php ru > ru.html
php source.php de > de.html
cd ..


echo "Done."