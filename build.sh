FIREFOX_ARCHIVE="bring-twitter-back-VERSION-firefox.zip"
CHROMIUM_ARCHIVE="bring-twitter-back-VERSION-chromium.zip"

echo "Building project"
tsc

if [ -e "$FIREFOX_ARCHIVE" ]; then
	echo "Deleting existing Firefox archive"
	rm "$FIREFOX_ARCHIVE"
fi

if [ -e "$CHROMIUM_ARCHIVE" ]; then
	echo "Deleting existing Chromium archive"
	rm "$CHROMIUM_ARCHIVE"
fi

echo "Archiving $FIREFOX_ARCHIVE"
cp manifest-v2.json manifest.json
./7zip/bash/7zzs a -tzip "./builds/$FIREFOX_ARCHIVE" ./dist/index.js ./icons ./LICENSE ./manifest.json
echo "Archived $FIREFOX_ARCHIVE"

echo "Archiving $CHROMIUM_ARCHIVE"
cp manifest-v3.json manifest.json
./7zip/bash/7zzs a -tzip "./builds/$CHROMIUM_ARCHIVE" ./dist/index.js ./icons ./LICENSE ./manifest.json
echo "Archived $CHROMIUM_ARCHIVE"

rm manifest.json
