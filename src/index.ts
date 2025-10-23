/*
Copyright 2023-2024 SauceyRed

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

console.log("Bring Twitter Back extension has loaded.");

const twitterLogoD = "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";

// Defines selectors for elements.
const xLogoSelector = 'path[d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z"]';
const notificationsSelector = 'a[href="/notifications"][role="link"]';
const tweetButtonsSelector = 'a[href="/compose/post"]';
const homeTweetButtonSelector = '[data-testid="tweetButtonInline"]';
const tweetComposerButtonSelector = 'button[data-testid="tweetButton"]';
const retweetSelector = 'div[data-testid="retweetConfirm"]';
const retweetsTrackerSelector = 'div[role="group"]';
const tweetComposerSelector = 'div[data-viewportview="true"]';
const profileTweetsTextSelector = 'a[role="tab"]';
const tweetPostTitleSelector = 'h2[dir="ltr"][aria-level="2"][role="heading"]';
const loginFooterSelector = 'nav[class="css-175oi2r r-18u37iz r-1w6e6rj r-3pj75a r-1777fci r-1mmae3n"]';
const cookieBannerSelector = 'div[class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1qd0xha r-n6v787 r-1cwl3u0 r-16dba41 r-5oul0u r-knv0ih"]';
const loadingLogoSelector = 'svg[class="r-4qtqp9 r-yyyyoo r-dnmrzs r-lrvibr r-m6rgpd r-1p0dtai r-1nao33i r-wy61xf r-zchlnj r-1d2f490 r-ywje51 r-u8s1d r-ipm5af r-1blnp2b"] path';
const retweetPostOptionsSelector = '[class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1qd0xha r-a023e6 r-rjixqe r-b88u0q"]';
const deletedTweetAlertSelector = 'div[role="alert"][data-testid="toast"]';
const timelineSelector = 'div[aria-label="Timeline: Your Home Timeline"]';
const notificationsTimelineSelector = 'div[aria-label="Timeline: Notifications"]';

const homeIconLogo = "M 174.79984,0.062917 349.60422,108.351317 332.85510,135.407597 312.88500,122.201557 312.88500,274.232032 C 312.88500,274.232032 312.24080,307.086072 277.77627,310.629162 243.31173,314.172242 174.79984,310.629162 174.79984,310.629162 Z M 174.80438,0.000000 0.00000,108.288407 16.74912,135.344687 36.71922,122.138647 36.71922,274.169122 C 36.71922,274.169122 37.36342,307.023162 71.82795,310.566252 106.29249,314.109332 174.80438,310.566252 174.80438,310.566252 Z M 228.854139,172.835386 A 53.916889,53.916889 0 1 0 121.020361,172.835386 A 53.916889,53.916889 0 1 0 228.854139,172.835386 Z";
const homeIconEmptySelector = 'path[d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"]';
const homeIconFilledSelector = 'path[d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"]';

let notificationObserverConnected = false;
let logoObserverConnected = false;

const loggingKey = "bringTwitterBack.loggingEnabled";
if (!localStorage.getItem(loggingKey)) {
	localStorage.setItem(loggingKey, "false");
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message: string) {
	if (localStorage.getItem(loggingKey) == "true") {
		console.log(message);
	}
}

function updateFavicon(faviconPath = "icons/favicon.ico") {
	// Iterates through <link> elements to find the icon, then removes it.
	const elements = document.getElementsByTagName("link");
	for (let i = 0; i < elements.length; i++) {
		if (elements[i].getAttribute("rel") && elements[i].getAttribute("rel") == "shortcut icon") {
			elements[i].remove();
		}
	}
	const divElements = document.querySelectorAll('div[dir="ltr"][aria-live="polite"]');
	if (divElements.length) {
		log("unread items divElements found");
		const regex = /^(\\d+)\\+?\\sunread\\sitems$/;
		for (let i = 0; i < divElements.length; i++) {
			const attribute = divElements[i].getAttribute("aria-label");
			if (divElements && attribute && regex.test(attribute)) {
				faviconPath = "../icons/favicon-notification.ico";
			}
		}
	}
	const faviconURL = typeof chrome != "undefined" ? chrome.runtime.getURL(faviconPath) : browser.runtime.getURL(faviconPath);
	// Creates new <link> element for the icon.
	const favicon = document.createElement("link");
	favicon.setAttribute("rel", "shortcut icon");
	favicon.setAttribute("href", faviconURL);
	document.head.appendChild(favicon);
}

function updateTitle() {
	let titleElement = document.querySelector("title");
	
	if (!titleElement) {
		return log("titleElement not found");
	}

	log("titleElement found");
	let tabTitle = titleElement.textContent;
	if (tabTitle && tabTitle.includes("X")) {
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

function updateLogo() {
	const loadingLogo = document.querySelector(loadingLogoSelector);
	if (!loadingLogo) {
		log("loadingLogo not found");
		return
	}
	log("loadingLogo found");
	if (loadingLogo) {
		loadingLogo.setAttribute("d", twitterLogoD);
	}
}

updateLogo();

// When one of the selectors is found, replaces the svg, then disconnects the observer.
const bodyCallback = (mutationList: MutationRecord[], observer: MutationObserver) => {
	for (let _ of mutationList) {
		const xLogoResult = document.querySelector(xLogoSelector);
		if (xLogoResult && xLogoResult.parentElement && xLogoResult.parentElement.parentElement) {
			const logoSvg = xLogoResult.parentElement.parentElement;
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

		if (document.querySelector(loadingLogoSelector)) {
			if (!logoObserverConnected) {
				startLogoObserver();
			}
		}

		const tweetButtonsSelectorResults = document.querySelectorAll(tweetButtonsSelector);
		if (tweetButtonsSelectorResults) {
			for (const result of tweetButtonsSelectorResults) {
				const spans = document.getElementsByTagName("span");
				for (const span of spans) {
					if (span.textContent == "Post") {
						span.textContent = "Tweet";
					}
				}
			}
		}

		const homeTweetButtonResult = document.querySelector(homeTweetButtonSelector);
		if (homeTweetButtonResult) {
			const homeTweetButton = homeTweetButtonResult.getElementsByTagName("span")[1];
			if (homeTweetButton && homeTweetButton.textContent == "Post") {
				homeTweetButton.textContent = "Tweet";
			}
		}

		const tweetComposerButtonResult = document.querySelector(tweetComposerButtonSelector);
		if (tweetComposerButtonResult) {
			const tweetButton = tweetComposerButtonResult.getElementsByTagName("span")[1];
			if (tweetButton && tweetButton && tweetButton.textContent == "Post") {
				tweetButton.textContent = "Tweet";
			}
		}

		const retweetResult = document.querySelector(retweetSelector);
		if (retweetResult) {
			const retweetButton = retweetResult.getElementsByTagName("span")[0];
			if (retweetButton && retweetButton.textContent == "Repost") {
				retweetButton.textContent = "Retweet";
			}
		}
		
		const tweetComposerResult = document.querySelector(tweetComposerSelector);
		const retweetsTrackerResult = document.querySelector(retweetsTrackerSelector);
		if (!tweetComposerResult && retweetsTrackerResult) {
			const repostsSpan = retweetsTrackerResult.getElementsByTagName("span")[3]
			if (repostsSpan && repostsSpan.textContent == "Reposts") {
				repostsSpan.textContent = "Retweets";
			}
		}

		const profileTweetsTextResult = document.querySelector(profileTweetsTextSelector);
		if (profileTweetsTextResult) {
			const profileTweets = profileTweetsTextResult.querySelector("span");
			if (profileTweets && profileTweets.textContent == "Posts") {
				profileTweets.textContent = "Tweets";	
			}
		}

		const tweetPostTitleResult = document.querySelectorAll(tweetPostTitleSelector);
		if (tweetPostTitleResult && tweetPostTitleResult[1]) {
			const tweetPostTitle = tweetPostTitleResult[1].getElementsByTagName("span")[0];
			if (tweetPostTitle && tweetPostTitle.textContent == "Post") {
				tweetPostTitle.textContent = "Tweet";
			}
		}

		const retweetPostOptionsResults = document.querySelectorAll(retweetPostOptionsSelector);
		if (retweetPostOptionsResults) {
			for (const result of retweetPostOptionsResults) {
				const span = result.children[0];
				switch (span.textContent) {
					case "Repost":
						span.textContent = "Retweet";
						break;
					case "Quote":
						span.textContent = "Quote Tweet";
						break;
					case "View Quotes":
						span.textContent = span.textContent.replace("View Quotes", "View Retweets");
						break;
				}
			}
		}

		const loginFooterResult = document.querySelector(loginFooterSelector);
		if (loginFooterResult) {
			log("found login footer");
			for (const result of loginFooterResult.children) {
				if (!result.children.length) { continue; }
				const span = result.getElementsByTagName("span")[0];
				if (!span || !span.textContent) { continue; }
				if (span.textContent.includes("X")) {
					span.textContent = span.textContent.replace("X", "Twitter");
				}
			}
		}

		const cookieBannerResult = document.querySelector(cookieBannerSelector);
		if (cookieBannerResult && cookieBannerResult.textContent && cookieBannerResult.textContent.includes("X")) {
			cookieBannerResult.textContent = cookieBannerResult.textContent.replaceAll("X", "Twitter");
		}

		const deletedTweetAlertResult = document.querySelector(deletedTweetAlertSelector);
		if (deletedTweetAlertResult) {
			const span = deletedTweetAlertResult.getElementsByTagName("span")[0];
			if (!span || !span.textContent) { continue; }
			if (span.textContent.includes("post")) {
				span.textContent = span.textContent.replace("post", "tweet");
			}
		}

		const timelineResult = document.querySelector(timelineSelector);
		if (timelineResult) {
			const buttons = timelineResult.getElementsByTagName("span");
			if (buttons.length == 0) {
				log("No timeline buttons");
			} else {
				if (buttons[0].textContent && buttons[0].textContent.includes("posts")) {
					buttons[0].textContent = buttons[0].textContent.replace("posts", "tweets");
				}
			}
		}

		const notifTimelineResult = document.querySelector(notificationsTimelineSelector);
		if (notifTimelineResult) {
			const articles = notifTimelineResult.getElementsByTagName("article");
			const regex = /(liked|reposted)( \d of)? your (re)?post(s)?/;
			for (const article of articles) {
				const actionDiv = article.children[0].children[1].children[1];
				const spans = actionDiv.getElementsByTagName("span");
				for (const span of spans) {
					if (span.textContent && regex.test(span.textContent)) {
						if (span.textContent.includes("post")) {
							span.textContent = span.textContent.replaceAll("post", "tweet");
						}
					}
				}
			}
		}

		const homeIconResult = document.querySelector(homeIconEmptySelector) || document.querySelector(homeIconFilledSelector);
		if (homeIconResult && homeIconResult.parentElement && homeIconResult.parentElement.parentElement) {
			log("home icon stuff!");
			const iconSvg = homeIconResult.parentElement.parentElement;

			const path = iconSvg.getElementsByTagName("path")[0];
			path.setAttribute("d", homeIconLogo);
			path.setAttribute("fill-rule", "evenodd");
			path.setAttribute("transform", "translate(0,1.2837497213) scale(0.068649056925)");

			// Checks if the element contains the class used for the default background theme/color (white),
			// in which case it sets the SVG's color to blue.
			if (document.body.style.backgroundColor == "rgb(255, 255, 255)") {
				iconSvg.setAttribute("style", "color: #1D9BF0;");
			}
		}
	}
}

const bodyObserver = new MutationObserver(bodyCallback);

const notificationCallback = (mutationList: MutationRecord[]) => {
	for (let _ of mutationList) {
		updateFavicon();
	}
}
const notificationObserver = new MutationObserver(notificationCallback);

function startNotificationObserver() {
	notificationObserver.observe(document.querySelector(notificationsSelector)!, { childList: true, subtree: true });
	notificationObserverConnected = true;
}


const metaObserverCallback = (mutationList: MutationRecord[]) => {
	for (let _ of mutationList) {
		if (document.querySelector("title")) {
			startTitleObserver();
			metaObserver.disconnect();
		}
	}
}
const metaObserver = new MutationObserver(metaObserverCallback);

const titleCallback = (mutationList: MutationRecord[]) => {
	for (let _ of mutationList) {
		titleObserver.disconnect();
		updateTitle();
		titleObserver.observe(document.querySelector("title")!, { childList: true });
	}
}
const titleObserver = new MutationObserver(titleCallback);

function startTitleObserver() {
	titleObserver.observe(document.querySelector("title")!, { childList: true });
}

const loadingLogoObserverCallback = (mutationList: MutationRecord[]) => {
	for (let _ of mutationList) {
		updateLogo();
		const loadingLogo = document.querySelector(loadingLogoSelector);
		if (loadingLogo) {
			if (loadingLogo && loadingLogo.getAttribute("d") == twitterLogoD) {
				log("Logo is Twitter logo");
				loadingLogoObserver.disconnect();
			} else {
				log("Logo has no path");
			}
		} else {
			log("Logo is not Twitter logo");
		}
	}
}
const loadingLogoObserver = new MutationObserver(loadingLogoObserverCallback);

function startLogoObserver() {
	loadingLogoObserver.observe(document.querySelector(loadingLogoSelector)!, { childList: true, subtree: true });
	logoObserverConnected = true;
	log("Started logo observer");
}

(async () => {
	while (true) {
		if (document.head) {
			log("Document head found");
			updateFavicon();
		}

		if (document.body) {
			log("Document body found")
			bodyObserver.observe(document.body, { childList: true, subtree: true });
			metaObserver.observe(document.head, { childList: true, subtree: true });
			log("Observers started");
			break;
		}
		await delay(100);
	}
})();
