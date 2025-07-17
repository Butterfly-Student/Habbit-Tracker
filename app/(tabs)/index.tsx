import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import EmptyState from "@/components/EmptyState";
import HabitCard from "@/components/HabitCard";
import ProgressBar from "@/components/ProgressBar";
import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";
import { getTodayFormatted } from "@/utils/date";

export default function HomeScreen() {
  const router = useRouter();
  const allHabits = useHabitStore((state) => state.habits);

  const { habits, completedHabits, progress } = useMemo(() => {
    const activeHabits = allHabits.filter((habit) => !habit.archived);
    const today = getTodayFormatted();
    const completedToday = activeHabits.filter((habit) =>
      habit.completedDates.includes(today)
    );

    const progressValue = activeHabits.length === 0 ? 0 : completedToday.length / activeHabits.length;

    return {
      habits: activeHabits,
      completedHabits: completedToday,
      progress: progressValue,
    };
  }, [allHabits]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const navigateToNewHabit = () => {
    router.push("/habit/new");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.title}>My Habits</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToNewHabit}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {habits.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressText}>
              {completedHabits.length}/{habits.length} completed
            </Text>
          </View>
          <ProgressBar progress={progress} />
        </View>
      )}

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitCard habit={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            message="No habits yet"
            subMessage="Tap the + button to create your first habit"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  date: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
});