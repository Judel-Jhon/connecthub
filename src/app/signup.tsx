import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import {
  DEPARTMENTS,
  MOCK_USER_ACCOUNTS,
  User,
} from '../constants/connectHubData';
import { AuthStore } from '../constants/authStore';

// ── Password strength helper ───────────────────────────────────
function getPasswordStrength(pw: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  if (pw.length === 0) return { score: 0, label: '', color: '#E2E8F0' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: 'Too short', color: '#EF4444' },
    1: { label: 'Weak', color: '#EF4444' },
    2: { label: 'Fair', color: '#F59E0B' },
    3: { label: 'Good', color: '#3B82F6' },
    4: { label: 'Strong', color: '#10B981' },
  };

  return { score: score as 0 | 1 | 2 | 3 | 4, ...map[score] };
}

// ── Generate initials from full name ──────────────────────────
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSignup = () => {
    setError(null);

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!department) {
      setError('Please select your department or office.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (strength.score < 2) {
      setError('Password is too weak. Add uppercase letters, numbers, or symbols.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    const emailKey = email.trim().toLowerCase();

    // Duplicate check
    if (MOCK_USER_ACCOUNTS[emailKey]) {
      setError('An account with this email already exists. Please log in instead.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const newUser: User = {
        id: `u${Date.now()}`,
        name: name.trim(),
        email: emailKey,
        role: 'stakeholder',
        department,
        avatar: getInitials(name),
      };

      // ✅ Register in the shared accounts store
      MOCK_USER_ACCOUNTS[emailKey] = {
        password,
        user: newUser,
      };

      // ✅ Auto-login after registration
      AuthStore.login(newUser);

      setIsLoading(false);
      router.replace('/' as Href);
    }, 900);
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
              <Ionicons name="person-add" size={34} color="#FFF" />
            </View>
            <Text style={s.heroTitle}>Create Account</Text>
            <Text style={s.heroSub}>Join ConnectHub — JRMSU Stakeholder Platform</Text>
          </View>

          {/* ── Form Card ── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Sign up</Text>
            <Text style={s.cardSub}>Fill in your details to get started</Text>

            {/* Error Banner */}
            {error && (
              <View style={s.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            {/* Full Name */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Full Name</Text>
              <View style={[s.inputWrap, focusedInput === 'name' && s.inputWrapFocused]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={focusedInput === 'name' ? '#4F46E5' : '#94A3B8'}
                />
                <TextInput
                  style={s.input}
                  placeholder="Juan Dela Cruz"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={(v) => { setName(v); setError(null); }}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Email Address</Text>
              <View style={[s.inputWrap, focusedInput === 'email' && s.inputWrapFocused]}>
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

            {/* Department */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Department / Office</Text>
              <TouchableOpacity
                style={[s.inputWrap, showDeptPicker && s.inputWrapFocused]}
                onPress={() => setShowDeptPicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={department ? '#4F46E5' : '#94A3B8'}
                />
                <Text style={[s.input, { paddingVertical: 0, color: department ? '#0F172A' : '#94A3B8' }]}>
                  {department || 'Select your department'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
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
                  placeholder="Create a strong password"
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

              {/* Password strength meter */}
              {password.length > 0 && (
                <View style={s.strengthWrap}>
                  <View style={s.strengthBars}>
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={[
                          s.strengthBar,
                          { backgroundColor: i <= strength.score ? strength.color : '#E2E8F0' },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[s.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}
              <Text style={s.passwordHint}>
                At least 8 characters with uppercase, number, or symbol
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Confirm Password</Text>
              <View style={[
                s.inputWrap,
                focusedInput === 'confirm' && s.inputWrapFocused,
                confirmPassword.length > 0 && password !== confirmPassword && s.inputWrapError,
              ]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={focusedInput === 'confirm' ? '#4F46E5' : '#94A3B8'}
                />
                <TextInput
                  style={s.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#94A3B8"
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); setError(null); }}
                  onFocus={() => setFocusedInput('confirm')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} activeOpacity={0.7}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={s.matchError}>
                  <Ionicons name="close-circle" size={12} color="#EF4444" /> Passwords don't match
                </Text>
              )}
              {confirmPassword.length > 0 && password === confirmPassword && (
                <Text style={s.matchOk}>
                  <Ionicons name="checkmark-circle" size={12} color="#10B981" /> Passwords match
                </Text>
              )}
            </View>

            {/* Role info note */}
            <View style={s.roleNote}>
              <Ionicons name="information-circle-outline" size={16} color="#4F46E5" />
              <Text style={s.roleNoteText}>
                New accounts are registered as <Text style={{ fontWeight: '800' }}>Stakeholders</Text>.
                Admin access is granted by the system administrator.
              </Text>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[s.signUpBtn, isLoading && s.signUpBtnLoading]}
              onPress={handleSignup}
              activeOpacity={0.88}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={s.signUpBtnText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={s.footerRow}>
            <Text style={s.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login' as Href)} activeOpacity={0.8}>
              <Text style={s.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Department Picker Modal */}
      <Modal
        visible={showDeptPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeptPicker(false)}
      >
        <TouchableOpacity
          style={s.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDeptPicker(false)}
        >
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Select Department / Office</Text>
            <FlatList
              data={DEPARTMENTS}
              keyExtractor={(item) => item}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.modalItem, department === item && s.modalItemSelected]}
                  onPress={() => {
                    setDepartment(item);
                    setShowDeptPicker(false);
                  }}
                >
                  <Text style={[s.modalItemText, department === item && s.modalItemTextSelected]}>
                    {item}
                  </Text>
                  {department === item && (
                    <Ionicons name="checkmark" size={18} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#3730A3' },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 28,
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
    fontSize: 30,
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
    backgroundColor: '#FFF9F9',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },

  // Password strength
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 48,
    textAlign: 'right',
  },
  passwordHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 5,
  },

  // Match messages
  matchError: { fontSize: 12, color: '#EF4444', marginTop: 5, fontWeight: '600' },
  matchOk: { fontSize: 12, color: '#10B981', marginTop: 5, fontWeight: '600' },

  // Role note
  roleNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  roleNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#4338CA',
    lineHeight: 17,
  },

  // Sign up button
  signUpBtn: {
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
  signUpBtnLoading: { opacity: 0.8 },
  signUpBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },

  // Footer
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

  // Department modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemSelected: { backgroundColor: '#EEF2FF' },
  modalItemText: { fontSize: 15, color: '#334155', fontWeight: '500' },
  modalItemTextSelected: { color: '#4F46E5', fontWeight: '700' },
});