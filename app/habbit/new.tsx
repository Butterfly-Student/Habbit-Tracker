import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import HabitForm from "@/components/HabitForm";
import Colors from "@/constants/colors";

export default function NewHabitScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "New Habit",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
          headerShadowVisible: false,
        }}
      />
      <HabitForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});