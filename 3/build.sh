#!/bin/bash

echo "Zipping sources..."
rm vpass.zip
zip -jq9 vpass.zip vpass.html vpass.js

echo "Chrome extension..."
rm e-chrome/vpass.zip
cp vpass.html e-chrome/vpass/
cp vpass.js e-chrome/vpass/
tmp=$(cd e-chrome/vpass; zip -qr0 ../vpass.zip *)

echo "Opera extension..."
rm e-opera/vpass.oex
cp vpass.html e-opera/vpass/
cp vpass.js e-opera/vpass/
tmp=$(cd e-opera/vpass; zip -qr0 ../vpass.oex *)

echo "Firefox extension..."
rm e-firefox/vpass.xpi
cp vpass.html e-firefox/vpass/chrome/content/
cp vpass.js e-firefox/vpass/chrome/content/
tmp=$(cd e-firefox/vpass; zip -qr0 ../vpass.xpi *)

echo "Safari extension..."
cp vpass.html e-safari/vpass.safariextension/
cp vpass.js e-safari/vpass.safariextension/

echo "Readme..."
markdown readme.md > info/readme.html

echo "Done."
