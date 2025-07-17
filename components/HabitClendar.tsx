import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";
import { formatDate, getLastNDays, getShortDayName } from "@/utils/date";

type HabitCalendarProps = {
  completedDates: string[];
  days?: number;
};

export default function HabitCalendar({
  completedDates,
  days = 7,
}: HabitCalendarProps) {
  const dateList = getLastNDays(days);

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {dateList.map((date) => {
          const dateStr = formatDate(date);
          const isCompleted = completedDates.includes(dateStr);

          return (
            <View key={dateStr} style={styles.dayColumn}>
              <Text style={styles.dayName}>{getShortDayName(date)}</Text>
              <View
                style={[
                  styles.dateCircle,
                  isCompleted && styles.completedDateCircle,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    isCompleted && styles.completedDateText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayColumn: {
    alignItems: "center",
  },
  dayName: {
    fontSize: 12,
    color: Colors.light.muted,
    marginBottom: 4,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.highlight,
  },
  completedDateCircle: {
    backgroundColor: Colors.light.success,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  completedDateText: {
    color: "white",
  },
});