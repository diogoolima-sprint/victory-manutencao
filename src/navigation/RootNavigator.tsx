import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../state/AuthContext';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { LoginScreen } from '../screens/LoginScreen';
import { ForcePasswordScreen } from '../screens/ForcePasswordScreen';
import { NewTicketWizardScreen } from '../screens/NewTicketWizardScreen';
import { TicketDetailScreen } from '../screens/TicketDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.coral} size="large" />
      </View>
    );
  }

  if (!user) return <LoginScreen />;
  if (user.mustChangePassword) return <ForcePasswordScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="NewTicket" component={NewTicketWizardScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.victoryInk },
});
