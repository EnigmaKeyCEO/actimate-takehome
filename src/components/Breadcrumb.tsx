import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Folder } from "#/types/Folder";

interface BreadcrumbProps {
  path: Folder[];
  onNavigate: (folderId: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <View style={styles.container}>
      {path.map((folder, index) => (
        <View key={`${folder.id}-${index}`} style={styles.breadcrumbItem}>
          <TouchableOpacity onPress={() => onNavigate(folder.id)}>
            <Text style={styles.breadcrumbText}>
              {folder.name?.length || 0 > 15
                ? `${folder.name?.slice(0, 12)}...`
                : folder.name}
            </Text>
          </TouchableOpacity>
          {index < path.length - 1 && (
            <Text style={styles.separator}> &gt; </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbText: {
    color: "#007AFF",
    fontSize: 16,
  },
  separator: {
    fontSize: 16,
    color: "#333",
  },
});
