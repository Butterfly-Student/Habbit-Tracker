import { ClipboardList } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

type EmptyStateProps = {
  message: string;
  subMessage?: string;
};

export default function EmptyState({ message, subMessage }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <ClipboardList size={64} color={Colors.light.muted} />
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
    textAlign: "center",
  },
  subMessage: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 8,
    textAlign: "center",
  },
});