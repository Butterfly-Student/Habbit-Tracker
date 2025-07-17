const tintColorDark = '#fff';
const primaryColor = "#4A6FA5"; // Pastel blue
const secondaryColor = "#6BBF59"; // Pastel green

export default {
	light: {
		text: "#333333",
		background: "#F8F9FA",
		card: "#FFFFFF",
		tint: primaryColor,
		tabIconDefault: "#CCCCCC",
		tabIconSelected: primaryColor,
		primary: primaryColor,
		secondary: secondaryColor,
		border: "#EEEEEE",
		success: "#6BBF59",
		danger: "#E57373",
		warning: "#FFB74D",
		muted: "#9E9E9E",
		highlight: "#F5F5F5",
	},
	dark: {
		text: "#fff",
		background: "#000",
		tint: tintColorDark,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorDark,
	},
};
