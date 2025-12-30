import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Home</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name ?? '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? '-'}</Text>
        </View>

        <Pressable
          onPress={logout}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
        >
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0b1220',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#121b2e',
    borderWidth: 1,
    borderColor: '#1d2a44',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 14,
  },
  row: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: '#9aa4b2',
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 18,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#24324f',
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
