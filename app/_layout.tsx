import React from 'react';
import { Slot } from 'expo-router';
import AmplifyProvider from '../providers/AmplifyProvider';
import AppProvider from '../providers/AppProvider';

export default function AppLayout() {
  return (
    <AppProvider>
      <AmplifyProvider>
        <Slot />
      </AmplifyProvider>
    </AppProvider>
  );
}
