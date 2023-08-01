/*
Copyright 2023 SauceyRed

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

console.log("Bring Twitter Bird Back extension has loaded.");

function updateFavicon(faviconPath = "icons/favicon.ico") {
	// Iterates through <link> elements to find the icon, then removes it.
	const elements = document.getElementsByTagName("link");
	for (let i = 0; i < elements.length; i++) {
		if (elements[i].getAttribute("rel") && elements[i].getAttribute("rel") == "shortcut icon") {
			elements[i].remove();
		}
	}
	const divElements = document.querySelectorAll('div[dir="ltr"][aria-live="polite"]');
	const regex = new RegExp("^(\\d+)\\+?\\sunread\\sitems$");
	for (let i = 0; i < divElements.length; i++) {
		if (regex.test(divElements[i].getAttribute("aria-label"))) {
			faviconPath = "icons/favicon-notification.ico";
		}
	}
	// Creates new <link> element for the icon.
	const faviconURL = browser.runtime.getURL(faviconPath)
	const favicon = document.createElement("link");
	favicon.setAttribute("rel", "shortcut icon");
	favicon.setAttribute("href", faviconURL);
	document.head.appendChild(favicon);
}

updateFavicon();

var theme = "";
switch (document.body.style.backgroundColor) {
	case "rgb(0, 0, 0)":
		theme = "dark";
		break;
	case "rgb(21, 32, 43)":
		theme = "dim";
		break;
	case "rgb(255, 255, 255)":
		theme = "light";
		break;
}

// Defines selectors associated with the <svg> element for the logo.
const querySelectorInput = 'path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"]'

var logoFound = false;
var notificationFound = false;
// When one of the selectors is found, replaces the svg, then disconnects the observer.
const logoCallback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		if (document.querySelector(querySelectorInput)) {
			logoFound = true;
			var logoSvg = document.querySelector(querySelectorInput).parentNode.parentNode;
			logoSvg.getElementsByTagName("path")[0].setAttribute("d", "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z");
			logoSvg.setAttribute("viewBox", "0 0 24 24");

			// Checks if the element contains the class used for the default background theme/color (white),
			// in which case it sets the SVG's color to blue.
			if (theme == "light") {
				logoSvg.setAttribute("style", "color: #1D9BF0;");
			}
			if (notificationFound) {
				observer.disconnect();
			}
		} else if (document.querySelector('a[href="/notifications"][role="link"]') && !notificationFound) {
			notificationFound = true;
			startNotificationObserver();
			if (logoFound) {
				observer.disconnect();
			}
		}
	}
}
// Creates and initiates an observer.
const logoObserver = new MutationObserver(logoCallback);
logoObserver.observe(document.body, { childList: true, subtree: true });

function startNotificationObserver() {
	const notificationCallback = (mutationList, observer) => {
		for (let mutation of mutationList) {
			updateFavicon();
		}
	}
	const notificationObserver = new MutationObserver(notificationCallback);
	notificationObserver.observe(document.querySelector('a[href="/notifications"][role="link"]'), { childList: true, subtree: true });
}
