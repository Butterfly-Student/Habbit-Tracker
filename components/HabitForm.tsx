import { useRouter } from "expo-router";
import { Calendar, Clock } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Switch,
} from "react-native";

import Colors from "@/constants/colors";
import { useHabitStore } from "@/store/habitStore";
import { Habit } from "@/types/habit";

type HabitFormProps = {
  initialData?: Partial<Habit>;
  isEditing?: boolean;
};

export default function HabitForm({ initialData, isEditing = false }: HabitFormProps) {
  const router = useRouter();
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [frequencyType, setFrequencyType] = useState<"daily" | "weekly" | "custom">(
    initialData?.frequency?.type || "daily"
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.frequency?.days || [0, 1, 2, 3, 4, 5, 6]
  );
  const [timesPerWeek, setTimesPerWeek] = useState<number>(
    initialData?.frequency?.timesPerWeek || 1
  );
  const [reminderEnabled, setReminderEnabled] = useState(!!initialData?.reminderTime);
  const [reminderTime, setReminderTime] = useState(initialData?.reminderTime || "09:00");

  const isValid = name.trim().length > 0;

  const handleSave = () => {
    const habitData = {
      name: name.trim(),
      description: description.trim() || undefined,
      frequency: {
        type: frequencyType,
        days: frequencyType === "custom" ? selectedDays : undefined,
        timesPerWeek: frequencyType === "weekly" ? timesPerWeek : undefined,
      },
      reminderTime: reminderEnabled ? reminderTime : undefined,
    };

    if (isEditing && initialData?.id) {
      updateHabit(initialData.id, habitData);
    } else {
      addHabit(habitData);
    }

    router.back();
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="What habit do you want to track?"
          placeholderTextColor={Colors.light.muted}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add some details about this habit"
          placeholderTextColor={Colors.light.muted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyOptions}>
          <TouchableOpacity
            style={[
              styles.frequencyOption,
              frequencyType === "daily" && styles.frequencyOptionSelected,
            ]}
            onPress={() => setFrequencyType("daily")}
          >
            <Text
              style={[
                styles.frequencyOptionText,
                frequencyType === "daily" && styles.frequencyOptionTextSelected,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frequencyOption,
              frequencyType === "weekly" && styles.frequencyOptionSelected,
            ]}
            onPress={() => setFrequencyType("weekly")}
          >
            <Text
              style={[
                styles.frequencyOptionText,
                frequencyType === "weekly" && styles.frequencyOptionTextSelected,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frequencyOption,
              frequencyType === "custom" && styles.frequencyOptionSelected,
            ]}
            onPress={() => setFrequencyType("custom")}
          >
            <Text
              style={[
                styles.frequencyOptionText,
                frequencyType === "custom" && styles.frequencyOptionTextSelected,
              ]}
            >
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {frequencyType === "custom" && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Days</Text>
          <View style={styles.daysContainer}>
            {dayNames.map((day, index) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(index) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(index)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(index) && styles.dayButtonTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {frequencyType === "weekly" && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Times Per Week</Text>
          <View style={styles.timesPerWeekContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.timesButton,
                  timesPerWeek === num && styles.timesButtonSelected,
                ]}
                onPress={() => setTimesPerWeek(num)}
              >
                <Text
                  style={[
                    styles.timesButtonText,
                    timesPerWeek === num && styles.timesButtonTextSelected,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.formGroup}>
        <View style={styles.reminderHeader}>
          <Text style={styles.label}>Daily Reminder</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
            thumbColor={Colors.light.card}
          />
        </View>

        {reminderEnabled && (
          <View style={styles.reminderTimeContainer}>
            <Clock size={20} color={Colors.light.muted} />
            <TextInput
              style={styles.timeInput}
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder="09:00"
              placeholderTextColor={Colors.light.muted}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!isValid}
      >
        <Text style={styles.saveButtonText}>
          {isEditing ? "Update Habit" : "Create Habit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 80,
  },
  frequencyOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  frequencyOptionSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  frequencyOptionText: {
    color: Colors.light.text,
    fontWeight: "500",
  },
  frequencyOptionTextSelected: {
    color: "white",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.text,
  },
  dayButtonTextSelected: {
    color: "white",
  },
  timesPerWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timesButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  timesButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  timesButtonTextSelected: {
    color: "white",
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reminderTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timeInput: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.muted,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});