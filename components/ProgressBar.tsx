import React from "react";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/colors";

type ProgressBarProps = {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
};

export default function ProgressBar({
  progress,
  color = Colors.light.primary,
  height = 8,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
  },
});