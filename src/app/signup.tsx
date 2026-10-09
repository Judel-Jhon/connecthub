import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import { DEPARTMENTS } from '../constants/connectHubData';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<
    'name' | 'email' | 'password' | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/');
    }, 800);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={globalStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Logo */}
          <View style={globalStyles.headerContainer}>
            <View style={globalStyles.logoBadge}>
              <Ionicons name="person-add" size={28} color="#FFFFFF" />
            </View>
            <Text style={globalStyles.title}>Create Account</Text>
            <Text style={globalStyles.subtitle}>
              Join ConnectHub to submit concerns & stay informed
            </Text>
          </View>

          {/* Form Card */}
          <View style={globalStyles.card}>
            {/* Full Name */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Full Name</Text>
              <View
                style={[
                  globalStyles.inputContainer,
                  focusedInput === 'name' && globalStyles.inputContainerFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={focusedInput === 'name' ? '#6366F1' : '#64748B'}
                  style={globalStyles.inputIcon}
                />
                <TextInput
                  style={globalStyles.input}
                  placeholder="Juan Dela Cruz"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Email Address</Text>
              <View
                style={[
                  globalStyles.inputContainer,
                  focusedInput === 'email' && globalStyles.inputContainerFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={focusedInput === 'email' ? '#6366F1' : '#64748B'}
                  style={globalStyles.inputIcon}
                />
                <TextInput
                  style={globalStyles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Department */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Department / Office</Text>
              <TouchableOpacity
                style={globalStyles.pickerContainer}
                onPress={() => setShowDeptPicker(true)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={department ? '#0F172A' : '#94A3B8'}
                    style={globalStyles.inputIcon}
                  />
                  <Text
                    style={
                      department
                        ? globalStyles.pickerText
                        : globalStyles.pickerPlaceholder
                    }
                  >
                    {department || 'Select your department'}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', right: 14 }}
                />
              </TouchableOpacity>
            </View>

            {/* Password */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Password</Text>
              <View
                style={[
                  globalStyles.inputContainer,
                  focusedInput === 'password' && globalStyles.inputContainerFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedInput === 'password' ? '#6366F1' : '#64748B'}
                  style={globalStyles.inputIcon}
                />
                <TextInput
                  style={globalStyles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={globalStyles.eyeIconButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[globalStyles.button, { marginTop: 12 }]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={globalStyles.buttonText}>Create Account</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={globalStyles.footerContainer}>
            <Text style={globalStyles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={globalStyles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Department Picker Modal */}
      <Modal
        visible={showDeptPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeptPicker(false)}
      >
        <TouchableOpacity
          style={globalStyles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowDeptPicker(false)}
        >
          <View style={globalStyles.dropdownMenu}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#0F172A',
                padding: 16,
                paddingBottom: 8,
              }}
            >
              Select Department
            </Text>
            <FlatList
              data={DEPARTMENTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    globalStyles.dropdownItem,
                    department === item && globalStyles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setDepartment(item);
                    setShowDeptPicker(false);
                  }}
                >
                  <Text
                    style={[
                      globalStyles.dropdownItemText,
                      department === item && globalStyles.dropdownItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {department === item && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#4F46E5"
                      style={{ marginLeft: 'auto' }}
                    />
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