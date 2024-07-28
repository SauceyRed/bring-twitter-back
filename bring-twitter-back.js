/*
Copyright 2023-2024 SauceyRed

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/


console.log("Bring Twitter Bird Back extension has loaded.");

const twitterLogoD = "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";

// Defines selectors for elements.
const querySelectorInput = 'path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"]';
const notificationsSelector = 'a[href="/notifications"][role="link"]';
const navTweetButtonSelector = 'a[data-testid="SideNav_NewTweet_Button"]';
const inlineTweetButtonSelector = 'div[data-testid="tweetButtonInline"]';
const retweetSelector = 'div[data-testid="retweetConfirm"]';
const quoteTweetSelector = 'a[href="/compose/tweet"][role="menuitem"]';
const retweetsTrackerSelector = 'div[role="group"]';
const tweetComposerSelector = 'div[data-viewportview="true"]';
const profileTweetsTextSelector = 'a[role="tab"]';
const tweetPostTitleSelector = 'h2[dir="ltr"][aria-level="2"][role="heading"]';
const loginFooterSelector = 'nav[class="css-175oi2r r-18u37iz r-1w6e6rj r-3pj75a r-1777fci r-1mmae3n"]';
const cookieBannerSelector = 'div[class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1qd0xha r-n6v787 r-1cwl3u0 r-16dba41 r-5oul0u r-knv0ih"]';
const loadingLogoSelector = 'svg[class="r-4qtqp9 r-yyyyoo r-dnmrzs r-lrvibr r-m6rgpd r-1p0dtai r-1nao33i r-wy61xf r-zchlnj r-1d2f490 r-ywje51 r-u8s1d r-ipm5af r-1blnp2b"] path';

var notificationObserverConnected = false;


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


function updateTitle() {
	let titleElement = document.querySelector("title");
	let tabTitle = titleElement.textContent;
	if (tabTitle.includes("X")) {
		if (tabTitle.includes(" / X")) {
			tabTitle = tabTitle.replace(" / X", " / Twitter");
		} else if (tabTitle == "X") {
			tabTitle = tabTitle.replace("X", "Twitter");
		}

		if (tabTitle.includes(" on X: ")) {
			tabTitle = tabTitle.replace(" on X: ", " on Twitter: ");
		}
		
		if (tabTitle.includes("X. It’s what’s happening")) {
			tabTitle = tabTitle.replace("X. It’s what’s happening", "Twitter. It’s what’s happening");
		}

		document.title = tabTitle;
	}
}

updateTitle();

// When one of the selectors is found, replaces the svg, then disconnects the observer.
const bodyCallback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		const querySelectorResult = document.querySelector(querySelectorInput);
		if (querySelectorResult) {
			var logoSvg = querySelectorResult.parentNode.parentNode;
			logoSvg.getElementsByTagName("path")[0].setAttribute("d", twitterLogoD);
			logoSvg.setAttribute("viewBox", "0 0 24 24");

			// Checks if the element contains the class used for the default background theme/color (white),
			// in which case it sets the SVG's color to blue.
			if (document.body.style.backgroundColor == "rgb(255, 255, 255)") {
				logoSvg.setAttribute("style", "color: #1D9BF0;");
			}
		}

		if (document.querySelector(notificationsSelector)) {
			if (!notificationObserverConnected) {
				startNotificationObserver();
			}
		}

		const navTweetButtonResult = document.querySelector(navTweetButtonSelector);
		if (navTweetButtonResult) {
			let navTweetButton = navTweetButtonResult.getElementsByTagName("span")[2];
			if (navTweetButton.textContent == "Post") {
				navTweetButton.textContent = "Tweet";
			}
		}

		const inlineTweetButtonResult = document.querySelector(inlineTweetButtonSelector);
		if (inlineTweetButtonResult) {
			let inlineTweetButton = inlineTweetButtonResult.getElementsByTagName("span")[1];
			if (inlineTweetButton.textContent == "Post") {
				inlineTweetButton.textContent = "Tweet";
			}
		}

		const retweetResult = document.querySelector(retweetSelector);
		if (retweetResult) {
			let retweetButton = retweetResult.getElementsByTagName("span")[0];
			if (retweetButton.textContent == "Repost") {
				retweetButton.textContent = "Retweet";
			}
		}

		const quoteTweetResult = document.querySelector(quoteTweetSelector);
		if (quoteTweetResult) {
			let quoteTweetButton = quoteTweetResult.getElementsByTagName("span")[0];
			if (quoteTweetButton && quoteTweetButton.textContent == "Quote") {
				quoteTweetButton.textContent = "Quote Tweet";
			}
		}
		
		const tweetComposerResult = document.querySelector(tweetComposerSelector);
		const retweetsTrackerResult = document.querySelector(retweetsTrackerSelector);
		if (!tweetComposerResult && retweetsTrackerResult) {
			let repostsText = retweetsTrackerResult.getElementsByTagName("span")[3]
			if (repostsText && repostsText.textContent == "Reposts") {
				repostsText.textContent = "Retweets";
			}
		}

		const profileTweetsTextResult = document.querySelector(profileTweetsTextSelector);
		if (profileTweetsTextResult) {
			let profileTweets = profileTweetsTextResult.querySelector("span");
			if (profileTweets && profileTweets.textContent == "Posts") {
				profileTweets.textContent = "Tweets";	
			}
		}

		const tweetPostTitleResult = document.querySelectorAll(tweetPostTitleSelector);
		if (tweetPostTitleResult && tweetPostTitleResult[1]) {
			let tweetPostTitle = tweetPostTitleResult[1].querySelector("span")
			if (tweetPostTitle && tweetPostTitle.textContent == "Post") {
				tweetPostTitle.textContent = "Tweet";
			}
		}

		const loginFooterResult = document.querySelector(loginFooterSelector);
		if (loginFooterResult) {
			for (result of loginFooterResult.childNodes) {
				if (result.textContent.includes("X")) {
					result.textContent = result.textContent.replace("X", "Twitter");
				}
			}
		}

		const cookieBannerResult = document.querySelector(cookieBannerSelector);
		if (cookieBannerResult && cookieBannerResult.textContent.includes("X")) {
			cookieBannerResult.textContent = cookieBannerResult.textContent.replaceAll("X", "Twitter");
		}
	}
}


const bodyObserver = new MutationObserver(bodyCallback);

// Creates and initiates an observer.
bodyObserver.observe(document.body, { childList: true, subtree: true });


const notificationCallback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		updateFavicon();
	}
}
const notificationObserver = new MutationObserver(notificationCallback);

function startNotificationObserver() {
	notificationObserver.observe(document.querySelector(notificationsSelector), { childList: true, subtree: true });
	notificationObserverConnected = true;
}


const metaObserverCallback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		if (document.querySelector("title")) {
			startTitleObserver();
			metaObserver.disconnect();
		}
	}
}
const metaObserver = new MutationObserver(metaObserverCallback);
metaObserver.observe(document.head, { childList: true, subtree: true });


const titleCallback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		titleObserver.disconnect();
		updateTitle();
		titleObserver.observe(document.querySelector("title"), { childList: true });
	}
}
const titleObserver = new MutationObserver(titleCallback);

function startTitleObserver() {
	titleObserver.observe(document.querySelector("title"), { childList: true });
}

const loadingLogoObserverCallback = (mutationList, observer) => {
	for (let mutation of mutationList) {
		console.log("CHANGE");
		updateLogo();
		loadingLogoObserver.disconnect();
	}
}
const loadingLogoObserver = new MutationObserver(loadingLogoObserverCallback);
loadingLogoObserver.observe(document.querySelector(loadingLogoSelector), { childList: true, subtree: true });

function updateLogo() {
	const loadingLogo = document.querySelector(loadingLogoSelector);
	loadingLogo.setAttribute("d", twitterLogoD);
}

updateLogo();
