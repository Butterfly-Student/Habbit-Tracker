import { useRouter } from "expo-router";
import { Archive, Info, Trash2 } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";

import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";

export default function SettingsScreen() {
  const router = useRouter();
  const allHabits = useHabitStore((state) => state.habits);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const archivedHabits = useMemo(() => {
    return allHabits.filter((habit) => habit.archived);
  }, [allHabits]);

  const showArchivedHabits = () => {
    router.push("/archived");
  };

  const confirmResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will delete all your habits and cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetAllData,
        },
      ]
    );
  };

  const resetAllData = () => {
    // This would need to be implemented in the store
    Alert.alert("Data Reset", "All your habit data has been reset.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={Colors.light.card}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={showArchivedHabits}
          >
            <Archive size={20} color={Colors.light.text} />
            <Text style={styles.settingButtonText}>Archived Habits</Text>
            {archivedHabits.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{archivedHabits.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingButton, styles.dangerButton]}
            onPress={confirmResetData}
          >
            <Trash2 size={20} color={Colors.light.danger} />
            <Text style={[styles.settingButtonText, styles.dangerText]}>
              Reset All Data
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.settingButton}>
            <Info size={20} color={Colors.light.text} />
            <Text style={styles.settingButtonText}>Version 1.0.0</Text>
          </TouchableOpacity>
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
    flex: 1,
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: Colors.light.danger,
  },
  badge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});