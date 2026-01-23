@echo off
set FIREFOX_ARCHIVE=bring-twitter-back-VERSION-firefox.zip
set CHROMIUM_ARCHIVE=bring-twitter-back-VERSION-chromium.zip

echo "Building project"
tsc

if exist %FIREFOX_ARCHIVE% echo "Deleting existing Firefox archive" & del %FIREFOX_ARCHIVE%

if exist %CHROMIUM_ARCHIVE% echo "Deleting existing Chromium archive" & del %CHROMIUM_ARCHIVE%

echo "Copying .\src\popup\popup.html into .\dist\popup\"
copy src\popup\popup.html dist\popup\
echo "Done"

echo "Copying .\src\popup\popup.css into .\dist\popup\"
copy src\popup\popup.css dist\popup\
echo "Done"

echo "Copying browser-polyfill.js from node_modules to dist"
copy node_modules\webextension-polyfill\dist\browser-polyfill.js dist\browser-polyfill.js
echo "Done"

echo "Copying manifest-v2.json into manifest.json"
copy manifest-v2.json manifest.json
echo "Done"

echo "Archiving %FIREFOX_ARCHIVE%"
copy manifest-v2.json manifest.json \y
.\7zip\cmd\7za.exe a -tzip ".\builds\%FIREFOX_ARCHIVE%" .\dist\index.js .\icons .\LICENSE .\manifest.json
echo "Archived %FIREFOX_ARCHIVE%"

echo "Archiving %CHROMIUM_ARCHIVE%"
copy manifest-v3.json manifest.json \y
.\7zip\cmd\7za.exe a -tzip ".\builds\%CHROMIUM_ARCHIVE%" .\dist\index.js .\icons .\LICENSE .\manifest.json
echo "Archived %CHROMIUM_ARCHIVE%"

del manifest.json

echo "Done building project"
