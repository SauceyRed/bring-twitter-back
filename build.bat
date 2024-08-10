@echo off
set FIREFOX_ARCHIVE=bring-twitter-back-VERSION-firefox.zip
set CHROMIUM_ARCHIVE=bring-twitter-back-VERSION-chromium.zip

if exist %FIREFOX_ARCHIVE% echo "Deleting existing Firefox archive" & del %FIREFOX_ARCHIVE%

if exist %CHROMIUM_ARCHIVE% echo "Deleting existing Chromium archive" & del %CHROMIUM_ARCHIVE%

echo "Archiving %FIREFOX_ARCHIVE%"
copy manifest-v2.json manifest.json /y
.\7zip\cmd\7za.exe a -tzip ".\builds\%FIREFOX_ARCHIVE%" .\icons .\bring-twitter-back.js .\LICENSE .\manifest.json
echo "Archived %FIREFOX_ARCHIVE%"

echo "Archiving %CHROMIUM_ARCHIVE%"
copy manifest-v3.json manifest.json /y
.\7zip\cmd\7za.exe a -tzip ".\builds\%CHROMIUM_ARCHIVE%" .\icons .\bring-twitter-back.js .\LICENSE .\manifest.json
echo "Archived %CHROMIUM_ARCHIVE%"

del manifest.json