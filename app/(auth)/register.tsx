import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { register } from '@/services/auth.service';
import { useAuth } from '@/store/auth-context';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isDark = scheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const session = await register(name.trim(), email.trim(), password);
      await signIn(session);
      router.replace('/(tabs)');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBg     = isDark ? '#18212F' : '#F8FAFC';
  const inputBorder = isDark ? '#2D3A4A' : '#E2E8F0';
  const labelColor  = isDark ? '#CBD5E1' : '#374151';
  const dividerColor = isDark ? '#2D3A4A' : '#E2E8F0';
  const mutedColor  = isDark ? '#94A3B8' : '#6B7280';
  const socialBg    = isDark ? '#18212F' : '#F8FAFC';

  return (
    <SafeAreaView style={[s.root, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Fields */}
          <View style={s.fields}>
            <View>
              <Text style={[s.label, { color: labelColor }]}>Full Name</Text>
              <View style={[s.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                <TextInput
                  style={[s.input, { color: c.text }]}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View>
              <Text style={[s.label, { color: labelColor }]}>Email Address</Text>
              <View style={[s.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                <TextInput
                  style={[s.input, { color: c.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View>
              <Text style={[s.label, { color: labelColor }]}>Password</Text>
              <View style={[s.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                <TextInput
                  style={[s.input, { color: c.text }]}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign Up button */}
          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: c.tint, opacity: isLoading ? 0.75 : 1 }]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.primaryBtnText}>Sign Up</Text>
            }
          </TouchableOpacity>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={[s.footerText, { color: mutedColor }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[s.footerLink, { color: c.tint }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 },
  fields: { gap: 20, paddingTop: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  primaryBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 36, marginBottom: 28 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 13, fontWeight: '500' },
  socialRow: { flexDirection: 'row', gap: 14 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  socialBtnText: { fontSize: 14, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', paddingTop: 32 },
  footerText: { fontSize: 15, fontWeight: '500' },
  footerLink: { fontSize: 15, fontWeight: '700' },
});
