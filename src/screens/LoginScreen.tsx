import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Login failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            textContentType="password"
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setIsPasswordVisible(prev => !prev)}
          >
            {isPasswordVisible ? (
              <MaterialIcons name="visibility" color={'white'} size={18} />
            ) : (
              <MaterialIcons name="visibility-off" color={'white'} size={18} />
            )}
          </TouchableOpacity>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={onLogin}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.primaryButton,
            (pressed || isSubmitting) && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? 'Logging in…' : 'Login'}
          </Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Pressable
            onPress={() => navigation.navigate('Signup')}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Go to Signup</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0b1220',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9aa4b2',
  },
  card: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#121b2e',
    borderWidth: 1,
    borderColor: '#1d2a44',
  },
  label: {
    fontSize: 12,
    color: '#9aa4b2',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#24324f',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  error: {
    marginTop: 10,
    color: '#ff5858ff',
  },
  primaryButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#9aa4b2',
  },
  linkButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  linkText: {
    color: '#a5b4fc',
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
});
