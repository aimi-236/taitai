import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "./_layout";

type Props = {
  sortOrder: "asc" | "desc";
  onToggle: () => void;
};

const SortButton: React.FC<Props> = ({ sortOrder, onToggle }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.palette.background }]} onPress={onToggle}>
      <Text style={{ fontFamily: theme.font, color: theme.palette.text }}>
        並び替え ({sortOrder === "asc" ? "昇順" : "降順"})
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 5,
  },
});

export default SortButton;
