const optionsContainer = document.getElementById("options");

console.log("options container:", optionsContainer);
if (optionsContainer) {
	getSettings().then((settings: Settings) => {
		const checkboxes = optionsContainer.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
		console.log("settings:", settings);
		if (settings) {
			console.log("got checkboxes:", checkboxes);
			for (const checkbox of checkboxes) {
				switch (checkbox.id) {
					case "remove-nav-grok": {
						checkbox.checked = Boolean(settings.removeNavGrokButton);
						break;
					}
					case "remove-nav-premium": {
						checkbox.checked = Boolean(settings.removeNavPremiumButton);
						break;
					}
					case "remove-trending": {
						checkbox.checked = Boolean(settings.removeTrending);
						break;
					}
					case "remove-follow-suggestions": {
						checkbox.checked = Boolean(settings.removeFollowSuggestions);
						break;
					}
					case "remove-todays-news": {
						checkbox.checked = Boolean(settings.removeTodaysNews);
						break;
					}
				}
		
				console.log("adding listener for:", checkbox);
				checkbox.addEventListener("change", async () => {
					console.log("change detected");
					await updateSettings();
				});
			}
		}
	});
}

function getSettings() {
	const message: Message = {
		command: "get-settings",
	};

	return browser.runtime.sendMessage(message);
}

async function updateSettings(): Promise<void> {
	console.log("updating settings");
	const removeNavGrok = document.getElementById("remove-nav-grok") as HTMLInputElement | null;
	const removeNavPremium = document.getElementById("remove-nav-premium") as HTMLInputElement | null;
	const removeTrending = document.getElementById("remove-trending") as HTMLInputElement | null;
	const removeFollowSuggestions = document.getElementById("remove-follow-suggestions") as HTMLInputElement | null;
	const removeTodaysNews = document.getElementById("remove-todays-news") as HTMLInputElement | null;

	const settings: Settings = {
		removeTrending: Boolean(removeTrending?.checked),
		removeFollowSuggestions: Boolean(removeFollowSuggestions?.checked),
		removeTodaysNews: Boolean(removeTodaysNews?.checked),
		removeNavGrokButton: Boolean(removeNavGrok?.checked),
		removeNavPremiumButton: Boolean(removeNavPremium?.checked),
	};

	const message: Message = {
		command: "update-settings",
		payload: settings,
	};

	console.log("sending message");
	await browser.runtime.sendMessage(message);
}
