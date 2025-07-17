import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Edit2, Trash2 } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import HabitCalendar from "@/components/HabitClendar";
import ProgressBar from "@/components/ProgressBar";
import StatsCard from "@/components/StatsCard";
import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";
import { getCurrentStreak, getLongestStreak } from "@/utils/date";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const allHabits = useHabitStore((state) => state.habits);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const archiveHabit = useHabitStore((state) => state.archiveHabit);

  const habit = useMemo(() => {
    return allHabits.find((h) => h.id === id);
  }, [allHabits, id]);

  const habitStats = useMemo(() => {
    if (!habit) return null;

    const today = new Date();

    // Calculate 7-day completion rate
    let completed7Days = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (habit.completedDates.includes(dateStr)) {
        completed7Days++;
      }
    }

    // Calculate 30-day completion rate
    let completed30Days = 0;
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (habit.completedDates.includes(dateStr)) {
        completed30Days++;
      }
    }

    return {
      completionRate7Days: completed7Days / 7,
      completionRate30Days: completed30Days / 30,
      currentStreak: getCurrentStreak(habit.completedDates),
      longestStreak: getLongestStreak(habit.completedDates),
    };
  }, [habit]);

  if (!habit) {
    router.replace("/");
    return null;
  }

  if (!habitStats) {
    return null;
  }

  const confirmDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  };

  const confirmArchive = () => {
    Alert.alert(
      "Archive Habit",
      "Are you sure you want to archive this habit? You can restore it later from settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          onPress: handleArchive,
        },
      ]
    );
  };

  const handleDelete = () => {
    deleteHabit(id);
    router.back();
  };

  const handleArchive = () => {
    archiveHabit(id);
    router.back();
  };

  const handleEdit = () => {
    router.push(`/habit/edit/${id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: habit.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Edit2 size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{habit.name}</Text>
          {habit.description && (
            <Text style={styles.description}>{habit.description}</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            title="Current Streak"
            value={habitStats.currentStreak}
            subtitle="days"
          />
          <StatsCard
            title="Longest Streak"
            value={habitStats.longestStreak}
            subtitle="days"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <HabitCalendar completedDates={habit.completedDates} days={7} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completion Rate</Text>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Last 7 days</Text>
              <Text style={styles.progressValue}>
                {Math.round(habitStats.completionRate7Days * 100)}%
              </Text>
            </View>
            <ProgressBar progress={habitStats.completionRate7Days} />
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Last 30 days</Text>
              <Text style={styles.progressValue}>
                {Math.round(habitStats.completionRate30Days * 100)}%
              </Text>
            </View>
            <ProgressBar progress={habitStats.completionRate30Days} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <Text style={styles.frequencyText}>
            {habit.frequency.type === "daily"
              ? "Every day"
              : habit.frequency.type === "weekly"
                ? `${habit.frequency.timesPerWeek} times per week`
                : "Custom schedule"}
          </Text>

          {habit.frequency.type === "custom" && habit.frequency.days && (
            <View style={styles.daysContainer}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <View
                    key={day}
                    style={[
                      styles.dayBadge,
                      habit.frequency.days?.includes(index)
                        ? styles.activeDayBadge
                        : styles.inactiveDayBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        habit.frequency.days?.includes(index)
                          ? styles.activeDayText
                          : styles.inactiveDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.archiveButton]}
            onPress={confirmArchive}
          >
            <Text style={styles.buttonText}>Archive</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={confirmDelete}
          >
            <Trash2 size={16} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  editButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  section: {
    marginBottom: 24,
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
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  frequencyText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeDayBadge: {
    backgroundColor: Colors.light.primary,
  },
  inactiveDayBadge: {
    backgroundColor: Colors.light.highlight,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  activeDayText: {
    color: "white",
  },
  inactiveDayText: {
    color: Colors.light.muted,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 32,
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  archiveButton: {
    backgroundColor: Colors.light.muted,
  },
  deleteButton: {
    backgroundColor: Colors.light.danger,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});