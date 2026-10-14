import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { MOCK_USER_ACCOUNTS } from '../constants/connectHubData';
import { AuthStore } from '../constants/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const account = MOCK_USER_ACCOUNTS[email.trim().toLowerCase()];

      if (!account) {
        setIsLoading(false);
        setError('No account found with that email address.');
        return;
      }

      if (account.password !== password) {
        setIsLoading(false);
        setError('Incorrect password. Please try again.');
        return;
      }

      // ✅ Success — store user and navigate
      AuthStore.login(account.user);

      if (account.user.role === 'admin') {
        router.replace('/admin-dashboard' as Href);
      } else {
        router.replace('/');
      }
    }, 900);
  };

  // Fill demo credentials
  const fillDemo = (role: 'stakeholder' | 'admin') => {
    setError(null);
    if (role === 'admin') {
      setEmail('admin@jrmsu.edu.ph');
      setPassword('admin123');
    } else {
      setEmail('judel.cubelo@jrmsu.edu.ph');
      setPassword('stakeholder123');
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3730A3" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero ── */}
          <View style={s.hero}>
            <View style={s.logoBadge}>
              <Ionicons name="chatbubbles" size={36} color="#FFF" />
            </View>
            <Text style={s.heroTitle}>ConnectHub</Text>
            <Text style={s.heroSub}>JRMSU Stakeholder Concern Platform</Text>
          </View>

          {/* ── Form Card ── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Welcome back</Text>
            <Text style={s.cardSub}>Sign in to continue</Text>

            {/* Error Banner */}
            {error && (
              <View style={s.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Email Address</Text>
              <View style={[s.inputWrap, focusedInput === 'email' && s.inputWrapFocused, error && !email && s.inputWrapError]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={focusedInput === 'email' ? '#4F46E5' : '#94A3B8'}
                />
                <TextInput
                  style={s.input}
                  placeholder="name@jrmsu.edu.ph"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setError(null); }}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                {email.length > 0 && (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Password</Text>
              <View style={[s.inputWrap, focusedInput === 'password' && s.inputWrapFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedInput === 'password' ? '#4F46E5' : '#94A3B8'}
                />
                <TextInput
                  style={s.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(v) => { setPassword(v); setError(null); }}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember + Forgot */}
            <View style={s.rowBetween}>
              <TouchableOpacity
                style={s.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[s.checkbox, rememberMe && s.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={s.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={s.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[s.signInBtn, isLoading && s.signInBtnLoading]}
              onPress={handleLogin}
              activeOpacity={0.88}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={s.signInBtnText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Demo Credentials ── */}
          <View style={s.demoSection}>
            <View style={s.demoDivider}>
              <View style={s.demoDividerLine} />
              <Text style={s.demoDividerText}>Demo accounts</Text>
              <View style={s.demoDividerLine} />
            </View>

            <View style={s.demoCards}>
              {/* Stakeholder Demo */}
              <TouchableOpacity
                style={s.demoCard}
                onPress={() => fillDemo('stakeholder')}
                activeOpacity={0.85}
              >
                <View style={[s.demoAvatar, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={[s.demoAvatarText, { color: '#4F46E5' }]}>JC</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.demoName}>Judel Jhon Cubelo</Text>
                  <Text style={s.demoEmail}>judel.cubelo@jrmsu.edu.ph</Text>
                  <Text style={s.demoPass}>Password: stakeholder123</Text>
                </View>
                <View style={[s.demoRoleBadge, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="people-outline" size={12} color="#4F46E5" />
                  <Text style={[s.demoRoleText, { color: '#4F46E5' }]}>Stakeholder</Text>
                </View>
              </TouchableOpacity>

              {/* Admin Demo */}
              <TouchableOpacity
                style={s.demoCard}
                onPress={() => fillDemo('admin')}
                activeOpacity={0.85}
              >
                <View style={[s.demoAvatar, { backgroundColor: '#FEF2F2' }]}>
                  <Text style={[s.demoAvatarText, { color: '#DC2626' }]}>AD</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.demoName}>Admin ConnectHub</Text>
                  <Text style={s.demoEmail}>admin@jrmsu.edu.ph</Text>
                  <Text style={s.demoPass}>Password: admin123</Text>
                </View>
                <View style={[s.demoRoleBadge, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="shield-checkmark-outline" size={12} color="#DC2626" />
                  <Text style={[s.demoRoleText, { color: '#DC2626' }]}>Admin</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={s.demoHint}>Tap a card to auto-fill credentials</Text>
          </View>

          {/* ── Sign Up Link ── */}
          <View style={s.footerRow}>
            <Text style={s.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup' as Href)} activeOpacity={0.8}>
              <Text style={s.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#3730A3' },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: '#A5B4FC',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    marginHorizontal: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#64748B', marginBottom: 20 },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626', fontWeight: '600' },

  // Inputs
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputWrapFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  inputWrapError: {
    borderColor: '#FCA5A5',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },

  // Remember + Forgot
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  rememberText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  forgotText: { fontSize: 13, color: '#4F46E5', fontWeight: '700' },

  // Sign In button
  signInBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  signInBtnLoading: { opacity: 0.8 },
  signInBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },

  // Demo section
  demoSection: { marginHorizontal: 20, marginTop: 28 },
  demoDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  demoDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  demoDividerText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  demoCards: { gap: 10 },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  demoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  demoAvatarText: { fontSize: 14, fontWeight: '900' },
  demoName: { fontSize: 13, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  demoEmail: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 2 },
  demoPass: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  demoRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexShrink: 0,
  },
  demoRoleText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },

  demoHint: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 12,
  },

  // Footer signup link
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    paddingBottom: 8,
  },
  footerText: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  footerLink: { fontSize: 14, color: '#FFF', fontWeight: '800' },
});