browser.storage.sync.get("settings").then(async (value) => {
	console.log("Checking if settings exist");
	if (!Object.keys(value).length) {
		console.log("Initializing settings");
		await browser.storage.sync.set({ settings: {} });
		console.log("Settings initialized");
	} else {
		console.log("Settings exist");
	}
});

browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
	console.log("Received message");
	console.log("Command:", message.command);
	switch (message.command) {
		case "update-settings": {
			console.log("Updating settings");
			const settings = message.payload as Settings;
			await browser.storage.sync.set({ settings });
			console.log("Updated settings to:", settings);
			break;
		}
		case "get-settings": {
			console.log("Getting settings");
			const value = await browser.storage.sync.get("settings");
			console.log("Gotten settings:", value.settings);
			return value.settings;
		}
	}
});
