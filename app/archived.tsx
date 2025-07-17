import { Stack, useRouter } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";
import { Habit } from "@/types/habit";

export default function ArchivedHabitsScreen() {
  const router = useRouter();
  const allHabits = useHabitStore((state) => state.habits);
  const updateHabit = useHabitStore((state) => state.updateHabit);

  const archivedHabits = useMemo(() => {
    return allHabits.filter((habit) => habit.archived);
  }, [allHabits]);

  const handleRestore = (habit: Habit) => {
    Alert.alert(
      "Restore Habit",
      `Are you sure you want to restore "${habit.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Restore",
          onPress: () => {
            updateHabit(habit.id, { archived: false });
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Habit }) => (
    <View style={styles.habitItem}>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.habitDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => handleRestore(item)}
      >
        <RefreshCw size={16} color="white" />
        <Text style={styles.restoreButtonText}>Restore</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Archived Habits",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
        }}
      />

      <FlatList
        data={archivedHabits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            message="No archived habits"
            subMessage="Archived habits will appear here"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  restoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  restoreButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
});