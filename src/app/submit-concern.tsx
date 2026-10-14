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
  StatusBar,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import {
  CONCERN_CATEGORIES,
  DEPARTMENTS,
  PRIORITY_COLORS,
  ConcernPriority,
  MOCK_CONCERNS,
  MOCK_CURRENT_USER,
  Concern,
} from '../constants/connectHubData';
import { AuthStore } from '../constants/authStore';

// Simple AI priority simulation based on keywords in description
function inferAIPriority(text: string): ConcernPriority {
  const lower = text.toLowerCase();
  if (lower.includes('urgent') || lower.includes('fire') || lower.includes('danger') || lower.includes('injury')) return 'critical';
  if (lower.includes('broken') || lower.includes('not working') || lower.includes('failed') || lower.includes('cannot')) return 'high';
  if (lower.includes('slow') || lower.includes('issue') || lower.includes('problem')) return 'medium';
  return 'low';
}

export default function SubmitConcernScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a concern title.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Field', 'Please select a category.');
      return;
    }
    if (!department) {
      Alert.alert('Missing Field', 'Please select a department.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      Alert.alert('Missing Field', 'Please provide a detailed description (at least 10 characters).');
      return;
    }

    // Get logged-in user or fall back to mock
    const currentUser = AuthStore.getUser() ?? MOCK_CURRENT_USER;

    // AI-simulated suggestions
    const aiPriority = inferAIPriority(description);
    const aiConfidence = Math.floor(Math.random() * 18) + 78; // 78–95%

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-PH', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

    const newConcern: Concern = {
      id: `c${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'pending',
      priority: aiPriority,
      submittedBy: currentUser.name,
      submitterAvatar: currentUser.avatar,
      department,
      dateSubmitted: dateStr,
      lastUpdated: dateStr,
      // AI suggestions
      aiSuggestedCategory: category,
      aiSuggestedPriority: aiPriority,
      aiGeneratedSummary: `${title.trim()}. Submitted by ${currentUser.name} under ${department}.`,
      aiConfidence,
      statusHistory: [
        { status: 'pending', date: dateStr, updatedBy: 'System' },
      ],
      responses: [],
    };

    // ✅ Push to shared in-memory store — now visible to admin + My Concerns
    MOCK_CONCERNS.unshift(newConcern);

    Alert.alert(
      '✅ Concern Submitted',
      `Your concern has been submitted and will be reviewed by the admin.\n\nAI Priority: ${aiPriority.toUpperCase()} (${aiConfidence}% confidence)`,
      [{ text: 'OK', onPress: () => router.push('/my-concerns' as Href) }]
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={globalStyles.navHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            style={globalStyles.headerIconBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={globalStyles.brandTitle}>Submit Concern</Text>
            <Text style={globalStyles.brandSub}>Report an issue or concern</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Banner */}
          <View
            style={{
              backgroundColor: '#EEF2FF',
              borderRadius: 16,
              padding: 14,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              borderWidth: 1,
              borderColor: '#C7D2FE',
            }}
          >
            <Ionicons name="information-circle" size={22} color="#4F46E5" />
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: '#4338CA',
                lineHeight: 18,
              }}
            >
              Your concern will be reviewed by authorized personnel. AI-assisted
              analysis will suggest category and priority for faster processing.
            </Text>
          </View>

          {/* Form */}
          <View style={globalStyles.card}>
            {/* Concern Title */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Concern Title</Text>
              <View
                style={[
                  globalStyles.inputContainer,
                  focusedInput === 'title' && globalStyles.inputContainerFocused,
                ]}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={focusedInput === 'title' ? '#6366F1' : '#64748B'}
                  style={globalStyles.inputIcon}
                />
                <TextInput
                  style={globalStyles.input}
                  placeholder="Brief title of your concern"
                  placeholderTextColor="#64748B"
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setFocusedInput('title')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Category */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Category</Text>
              <TouchableOpacity
                style={[
                  globalStyles.pickerContainer,
                  showCategoryPicker && globalStyles.pickerContainerFocused,
                ]}
                onPress={() => setShowCategoryPicker(true)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="folder-outline"
                    size={20}
                    color={category ? '#0F172A' : '#94A3B8'}
                    style={globalStyles.inputIcon}
                  />
                  <Text
                    style={
                      category
                        ? globalStyles.pickerText
                        : globalStyles.pickerPlaceholder
                    }
                  >
                    {category || 'Select a category'}
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

            {/* Department */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Department</Text>
              <TouchableOpacity
                style={[
                  globalStyles.pickerContainer,
                  showDeptPicker && globalStyles.pickerContainerFocused,
                ]}
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
                    {department || 'Select target department'}
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

            {/* Description */}
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Detailed Description</Text>
              <TextInput
                style={[
                  globalStyles.textArea,
                  focusedInput === 'desc' && globalStyles.textAreaFocused,
                ]}
                placeholder="Describe your concern in detail. Include relevant dates, locations, and any other information that may help in processing."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                onFocus={() => setFocusedInput('desc')}
                onBlur={() => setFocusedInput(null)}
                multiline
                numberOfLines={6}
              />
            </View>

            {/* Attachment placeholder */}
            <TouchableOpacity
              style={[
                globalStyles.buttonSecondary,
                { marginBottom: 20 },
              ]}
            >
              <Ionicons
                name="attach-outline"
                size={20}
                color="#4F46E5"
                style={{ marginRight: 8 }}
              />
              <Text style={globalStyles.buttonSecondaryText}>
                Attach Files (Optional)
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Ionicons
                name="send-outline"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={globalStyles.buttonText}>Submit Concern</Text>
            </TouchableOpacity>
          </View>

          {/* Note */}
          <Text
            style={{
              color: '#94A3B8',
              fontSize: 12,
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 18,
            }}
          >
            By submitting, your concern will be processed through the{'\n'}
            Human-in-the-Loop AI-Assisted Framework.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          style={globalStyles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
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
              Select Category
            </Text>
            <FlatList
              data={CONCERN_CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    globalStyles.dropdownItem,
                    category === item && globalStyles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      globalStyles.dropdownItemText,
                      category === item && globalStyles.dropdownItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {category === item && (
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
                      department === item &&
                        globalStyles.dropdownItemTextSelected,
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
