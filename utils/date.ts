export const formatDate = (date: Date): string => {
	return date.toISOString().split("T")[0];
};

export const getTodayFormatted = (): string => {
	return formatDate(new Date());
};

export const getDayName = (date: Date): string => {
	return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const getShortDayName = (date: Date): string => {
	return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const getDaysInMonth = (year: number, month: number): number => {
	return new Date(year, month + 1, 0).getDate();
};

export const getLastNDays = (n: number): Date[] => {
	const result: Date[] = [];
	for (let i = n - 1; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		result.push(date);
	}
	return result;
};

export const isToday = (date: string): boolean => {
	return date === getTodayFormatted();
};

export const isDateInPast = (date: string): boolean => {
	const today = getTodayFormatted();
	return date < today;
};

export const getCurrentStreak = (completedDates: string[]): number => {
	if (completedDates.length === 0) return 0;

	const sortedDates = [...completedDates].sort();
	let streak = 0;
	let currentDate = new Date();

	// Check if today is completed
	if (completedDates.includes(formatDate(currentDate))) {
		streak = 1;
	} else {
		// Start checking from yesterday
		currentDate.setDate(currentDate.getDate() - 1);
	}

	// Count consecutive days backwards
	while (completedDates.includes(formatDate(currentDate))) {
		streak++;
		currentDate.setDate(currentDate.getDate() - 1);
	}

	return streak;
};

export const getLongestStreak = (completedDates: string[]): number => {
	if (completedDates.length === 0) return 0;

	const sortedDates = [...completedDates].sort();
	let longestStreak = 1;
	let currentStreak = 1;

	for (let i = 1; i < sortedDates.length; i++) {
		const prevDate = new Date(sortedDates[i - 1]);
		const currDate = new Date(sortedDates[i]);

		prevDate.setDate(prevDate.getDate() + 1);

		if (prevDate.toISOString().split("T")[0] === sortedDates[i]) {
			currentStreak++;
		} else {
			longestStreak = Math.max(longestStreak, currentStreak);
			currentStreak = 1;
		}
	}

	return Math.max(longestStreak, currentStreak);
};
