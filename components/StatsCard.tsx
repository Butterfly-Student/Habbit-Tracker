import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatsCard({ title, value, subtitle }: StatsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 4,
  },
});