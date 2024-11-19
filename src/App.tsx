import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NativeRouter, Route, Routes } from 'react-router-native';
import { FolderScreen } from './screens/FolderScreen';
import { FolderDetailScreen } from './screens/FolderDetailScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<FolderScreen />} />
          <Route path="/folder/:id" element={<FolderDetailScreen />} />
        </Routes>
      </NativeRouter>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});