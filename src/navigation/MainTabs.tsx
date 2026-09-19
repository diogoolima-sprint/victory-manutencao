import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from './types';
import { useAuth } from '../state/AuthContext';
import { canCreateTicket } from '../domain/permissions';
import { colors, fonts } from '../theme';
import { HomeIcon, ListIcon, ClipboardCheckIcon, SettingsIcon, PlusIcon } from '../components/icons';
import { HomeScreen } from '../screens/HomeScreen';
import { TicketListScreen } from '../screens/TicketListScreen';
import { ConfigScreen } from '../screens/ConfigScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

function NewTicketFabButton() {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.fabWrap} pointerEvents="box-none">
      <View style={styles.fab} onTouchEnd={() => rootNav.navigate('NewTicket')}>
        <PlusIcon />
      </View>
      <Text style={styles.fabLabel}>Novo</Text>
    </View>
  );
}

export function MainTabs() {
  const { user } = useAuth();
  if (!user) return null;

  const showPainel = user.role === 'admin' || user.role === 'gestor' || user.role === 'manutencao';
  const showNovo = canCreateTicket(user);
  const showMine = user.role === 'manutencao' || user.role === 'solicitante';
  const showConfig = user.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 10.5 },
        tabBarStyle: { height: 58, paddingBottom: 6, paddingTop: 6 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início', tabBarIcon: ({ color }) => <HomeIcon color={color} /> }}
      />
      {showPainel ? (
        <Tab.Screen
          name="Painel"
          component={TicketListScreen}
          options={{ title: 'Chamados', tabBarIcon: ({ color }) => <ListIcon color={color} /> }}
        />
      ) : null}
      {showNovo ? (
        <Tab.Screen
          name="NovoTabButton"
          component={HomeScreen} // never actually shown — tabPress is intercepted below
          options={{
            title: '',
            tabBarButton: () => <NewTicketFabButton />,
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
          }}
        />
      ) : null}
      {showMine ? (
        <Tab.Screen
          name="Mine"
          component={TicketListScreen}
          initialParams={undefined}
          options={{
            title: user.role === 'manutencao' ? 'Meus' : 'Meus',
            tabBarIcon: ({ color }) => <ClipboardCheckIcon color={color} />,
          }}
        />
      ) : null}
      {showConfig ? (
        <Tab.Screen
          name="Config"
          component={ConfigScreen}
          options={{ title: 'Config', tabBarIcon: ({ color }) => <SettingsIcon color={color} /> }}
        />
      ) : null}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  fabWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', top: -14 },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  fabLabel: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 10, color: colors.coral, marginTop: 2 },
});
