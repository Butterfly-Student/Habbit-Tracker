import { useRouter } from "expo-router";
import { CheckCircle2, Circle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";
import { Habit } from "@/types/habit";
import { getCurrentStreak, getTodayFormatted } from "@/utils/date";

type HabitCardProps = {
  habit: Habit;
};

export default function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();
  const toggleHabitCompletion = useHabitStore((state) => state.toggleHabitCompletion);

  const isCompletedToday = habit.completedDates.includes(getTodayFormatted());
  const currentStreak = getCurrentStreak(habit.completedDates);

  const handlePress = () => {
    router.push(`/habit/${habit.id}`);
  };

  const handleToggle = () => {
    toggleHabitCompletion(habit.id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompletedToday && styles.completedCard]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{habit.name}</Text>
          {currentStreak > 0 && (
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>{currentStreak} day streak</Text>
            </View>
          )}
        </View>

        {habit.description && (
          <Text style={styles.description} numberOfLines={2}>
            {habit.description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.checkContainer}
        onPress={handleToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isCompletedToday ? (
          <CheckCircle2 color={Colors.light.success} size={28} />
        ) : (
          <Circle color={Colors.light.muted} size={28} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  completedCard: {
    borderLeftColor: Colors.light.success,
    backgroundColor: Colors.light.highlight,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  checkContainer: {
    marginLeft: 12,
  },
  streakContainer: {
    backgroundColor: Colors.light.highlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    color: Colors.light.muted,
    fontWeight: "500",
  },
});