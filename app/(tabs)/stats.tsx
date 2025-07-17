import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";

import EmptyState from "@/components/EmptyState";
import HabitCalendar from "@/components/HabitClendar";
import ProgressBar from "@/components/ProgressBar";
import StatsCard from "@/components/StatsCard";
import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";
import { getCurrentStreak, getLongestStreak } from "@/utils/date";

export default function StatsScreen() {
  const allHabits = useHabitStore((state) => state.habits);

  const { habits, stats } = useMemo(() => {
    const activeHabits = allHabits.filter((habit) => !habit.archived);

    if (activeHabits.length === 0) {
      return {
        habits: activeHabits,
        stats: {
          totalHabits: 0,
          completionRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          allCompletedDates: [],
        },
      };
    }

    // Combine all completed dates
    const allCompletedDates = activeHabits.flatMap((habit) => habit.completedDates);

    // Get unique dates
    const uniqueDates = [...new Set(allCompletedDates)];

    // Calculate completion rate for last 7 days
    const last7DaysCompletionRates = activeHabits.map((habit) => {
      const today = new Date();
      let completedCount = 0;

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        if (habit.completedDates.includes(dateStr)) {
          completedCount++;
        }
      }

      return completedCount / 7;
    });

    const averageCompletionRate =
      last7DaysCompletionRates.reduce((sum, rate) => sum + rate, 0) /
      activeHabits.length;

    // Find habit with highest current streak
    const habitStreaks = activeHabits.map((habit) => getCurrentStreak(habit.completedDates));
    const maxCurrentStreak = Math.max(...habitStreaks);

    // Find habit with highest longest streak
    const habitLongestStreaks = activeHabits.map((habit) =>
      getLongestStreak(habit.completedDates)
    );
    const maxLongestStreak = Math.max(...habitLongestStreaks);

    return {
      habits: activeHabits,
      stats: {
        totalHabits: activeHabits.length,
        completionRate: averageCompletionRate,
        currentStreak: maxCurrentStreak,
        longestStreak: maxLongestStreak,
        allCompletedDates: uniqueDates,
      },
    };
  }, [allHabits]);

  if (habits.length === 0) {
    return (
      <EmptyState
        message="No habits to analyze"
        subMessage="Add some habits to see your stats"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Stats</Text>

        <View style={styles.statsRow}>
          <StatsCard
            title="Active Habits"
            value={stats.totalHabits}
            subtitle="Total habits"
          />
          <StatsCard
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="Consecutive days"
          />
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            title="Longest Streak"
            value={stats.longestStreak}
            subtitle="Best run"
          />
          <StatsCard
            title="Completion Rate"
            value={`${Math.round(stats.completionRate * 100)}%`}
            subtitle="Last 7 days"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <HabitCalendar completedDates={stats.allCompletedDates} days={7} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Completion</Text>
          {habits.map((habit) => {
            const today = new Date();
            let completedCount = 0;

            for (let i = 0; i < 7; i++) {
              const date = new Date();
              date.setDate(today.getDate() - i);
              const dateStr = date.toISOString().split("T")[0];

              if (habit.completedDates.includes(dateStr)) {
                completedCount++;
              }
            }

            const completionRate = completedCount / 7;

            return (
              <View key={habit.id} style={styles.habitProgress}>
                <View style={styles.habitProgressHeader}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitCompletionText}>
                    {Math.round(completionRate * 100)}%
                  </Text>
                </View>
                <ProgressBar
                  progress={completionRate}
                  color={Colors.light.primary}
                  height={6}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.light.text,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  section: {
    marginTop: 24,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.light.text,
  },
  habitProgress: {
    marginBottom: 16,
  },
  habitProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  habitName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  habitCompletionText: {
    fontSize: 14,
    color: Colors.light.muted,
  },
});