/*
Copyright 2023 SauceyRed

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

console.log("Bring Twitter Bird Back extension has loaded.");

// Iterates through <link> elements to find the icon, then removes it.
const elements = document.getElementsByTagName("link");
for (let i = 0; i < elements.length; i++) {
	if (elements[i].getAttribute("rel") && elements[i].getAttribute("rel") == "shortcut icon") {
		elements[i].remove();
	}
}

// Creates new <link> element for the icon.
const faviconURL = browser.runtime.getURL("icons/favicon.ico")
const favicon = document.createElement("link");
favicon.setAttribute("rel", "shortcut icon");
favicon.setAttribute("href", faviconURL);
document.head.appendChild(favicon);

// Defines selectors associated with the <svg> element for the logo.
const selectors = ["r-13v1u17", "r-cbkdnj", "r-16ek5rh"]

// When one of the selectors is found, replaces the svg, then disconnects the observer.
const callback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		for (let selector in selectors) {
			if (document.querySelector("." + selectors[selector])) {
				var logoSvg = document.getElementsByClassName(selectors[selector])[0];
				logoSvg.getElementsByTagName("path")[0].setAttribute("d", "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z");
				logoSvg.setAttribute("viewbox", "0 0 24 24");

				// Checks if the element contains the class used for the default background theme/color (white),
				// in which case it sets the SVG's color to blue.
				if (logoSvg.classList.contains("r-16ek5rh")) {
					logoSvg.setAttribute("style", "color: #1D9BF0;");
				}
				observer.disconnect();
			}
		}
	}
}

// Creates and initiates an observer.
const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });
