export type Habit = {
	id: string;
	name: string;
	description?: string;
	frequency: {
		type: "daily" | "weekly" | "custom";
		days?: number[]; // 0 = Sunday, 1 = Monday, etc.
		timesPerWeek?: number;
	};
	color?: string;
	icon?: string;
	createdAt: string;
	completedDates: string[]; // ISO date strings
	reminderTime?: string; // HH:MM format
	archived: boolean;
};

export type HabitCompletion = {
	date: string; // ISO date string
	completed: boolean;
};
