import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import HabitForm from "@/components/HabitForm";
import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = useHabitStore((state) => state.getHabitById(id));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit Habit",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
          headerShadowVisible: false,
        }}
      />
      {habit && <HabitForm initialData={habit} isEditing />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});