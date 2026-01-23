interface Message {
	command: string;
	payload?: Settings | undefined;
}

interface Settings {
	removeTrending?: boolean | undefined;
	removeFollowSuggestions?: boolean | undefined;
	removeTodaysNews?: boolean | undefined;
	removeNavGrokButton?: boolean | undefined;
	removeNavPremiumButton?: boolean | undefined;
}