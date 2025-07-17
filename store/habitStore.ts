import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Habit } from "@/types/habit";
import { formatDate, getTodayFormatted } from "@/utils/date";

interface HabitState {
	habits: Habit[];
	addHabit: (
		habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "archived">
	) => void;
	updateHabit: (id: string, updates: Partial<Habit>) => void;
	deleteHabit: (id: string) => void;
	archiveHabit: (id: string) => void;
	toggleHabitCompletion: (id: string, date?: string) => void;
	getHabitById: (id: string) => Habit | undefined;
	getActiveHabits: () => Habit[];
	getArchivedHabits: () => Habit[];
	getCompletedHabitsForToday: () => Habit[];
	getHabitCompletionRate: (id: string, days: number) => number;
}

export const useHabitStore = create<HabitState>()(
	persist(
		(set, get) => ({
			habits: [],

			addHabit: (habitData) => {
				const newHabit: Habit = {
					id: Date.now().toString(),
					createdAt: new Date().toISOString(),
					completedDates: [],
					archived: false,
					...habitData,
				};

				set((state) => ({
					habits: [...state.habits, newHabit],
				}));
			},

			updateHabit: (id, updates) => {
				set((state) => ({
					habits: state.habits.map((habit) =>
						habit.id === id ? { ...habit, ...updates } : habit
					),
				}));
			},

			deleteHabit: (id) => {
				set((state) => ({
					habits: state.habits.filter((habit) => habit.id !== id),
				}));
			},

			archiveHabit: (id) => {
				set((state) => ({
					habits: state.habits.map((habit) =>
						habit.id === id ? { ...habit, archived: true } : habit
					),
				}));
			},

			toggleHabitCompletion: (id, date = getTodayFormatted()) => {
				set((state) => {
					const habit = state.habits.find((h) => h.id === id);
					if (!habit) return state;

					const isCompleted = habit.completedDates.includes(date);
					const updatedCompletedDates = isCompleted
						? habit.completedDates.filter((d) => d !== date)
						: [...habit.completedDates, date];

					return {
						habits: state.habits.map((h) =>
							h.id === id ? { ...h, completedDates: updatedCompletedDates } : h
						),
					};
				});
			},

			getHabitById: (id) => {
				return get().habits.find((habit) => habit.id === id);
			},

			getActiveHabits: () => {
				return get().habits.filter((habit) => !habit.archived);
			},

			getArchivedHabits: () => {
				return get().habits.filter((habit) => habit.archived);
			},

			getCompletedHabitsForToday: () => {
				const today = getTodayFormatted();
				return get()
					.getActiveHabits()
					.filter((habit) => habit.completedDates.includes(today));
			},

			getHabitCompletionRate: (id, days) => {
				const habit = get().getHabitById(id);
				if (!habit) return 0;

				const today = new Date();
				let completedCount = 0;

				for (let i = 0; i < days; i++) {
					const date = new Date();
					date.setDate(today.getDate() - i);
					const dateStr = formatDate(date);

					if (habit.completedDates.includes(dateStr)) {
						completedCount++;
					}
				}

				return completedCount / days;
			},
		}),
		{
			name: "habit-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
