FIREFOX_ARCHIVE="bring-twitter-back-VERSION-firefox.zip"
CHROMIUM_ARCHIVE="bring-twitter-back-VERSION-chromium.zip"

echo "Building project"
tsc

if [ -e "$FIREFOX_ARCHIVE" ]; then
	echo "Deleting existing Firefox archive"
	rm "$FIREFOX_ARCHIVE"
	echo "Done"
fi

if [ -e "$CHROMIUM_ARCHIVE" ]; then
	echo "Deleting existing Chromium archive"
	rm "$CHROMIUM_ARCHIVE"
	echo "Done"
fi

echo "Copying src/popup/popup.html into dist/popup/"
cp src/popup/popup.html dist/popup/
echo "Done"

echo "Copying src/popup/popup.css into dist/popup/"
cp src/popup/popup.css dist/popup/
echo "Done"

echo "Copying browser-polyfill.js from node_modules to dist"
cp node_modules/webextension-polyfill/dist/browser-polyfill.js dist/browser-polyfill.js
echo "Done"

echo "Copying manifest-v2.json into manifest.json"
cp manifest-v2.json manifest.json
echo "Done"

echo "Archiving $FIREFOX_ARCHIVE"
./7zip/bash/7zzs a -tzip "./builds/$FIREFOX_ARCHIVE" ./dist/* ./icons ./LICENSE ./manifest.json
echo "Archived $FIREFOX_ARCHIVE"

echo "Copying manifest-v3.json into manifest.json"
cp manifest-v3.json manifest.json
echo "Done"

echo "Archiving $CHROMIUM_ARCHIVE"
./7zip/bash/7zzs a -tzip "./builds/$CHROMIUM_ARCHIVE" ./dist/* ./icons ./LICENSE ./manifest.json
echo "Archived $CHROMIUM_ARCHIVE"

rm manifest.json

echo "Done building project"
