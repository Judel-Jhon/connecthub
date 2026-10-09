import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import {
  MOCK_CONCERNS,
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '../constants/connectHubData';

export default function AdminReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const concern = MOCK_CONCERNS.find((c) => c.id === id) || MOCK_CONCERNS[0];

  const [activeSection, setActiveSection] = useState<
    'original' | 'ai' | 'decision'
  >('original');

  const handleAcceptAI = () => {
    Alert.alert(
      'Accept AI Suggestion',
      'Are you sure you want to accept the AI-generated category and priority as the final decision?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => Alert.alert('Accepted', 'AI suggestion has been accepted as final decision.') },
      ]
    );
  };

  const handleOverride = () => {
    Alert.alert(
      'Override AI Suggestion',
      'You can modify the category and priority manually. This will be recorded as a human override.',
      [{ text: 'OK' }]
    );
  };

  const handleManualFallback = () => {
    Alert.alert(
      'Manual Fallback',
      'Processing concern without AI assistance. You will assign category and priority manually.',
      [{ text: 'OK' }]
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
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.brandTitle}>Review Concern</Text>
            <Text style={globalStyles.brandSub}>
              HITL AI-Assisted Processing
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Status Banner */}
        <View
          style={[
            globalStyles.detailHeaderBanner,
            { backgroundColor: STATUS_COLORS[concern.status], height: 140 },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={globalStyles.badgeTag}>
              <Text style={globalStyles.badgeTagText}>
                {STATUS_LABELS[concern.status]}
              </Text>
            </View>
            <View style={globalStyles.badgeTag}>
              <Text style={globalStyles.badgeTagText}>
                {PRIORITY_LABELS[concern.priority]}
              </Text>
            </View>
          </View>
          <Text style={[globalStyles.detailTitle, { fontSize: 18 }]} numberOfLines={2}>
            {concern.title}
          </Text>
        </View>

        {/* Three-Panel Tabs: Original | AI Suggestion | Human Decision */}
        <View style={[globalStyles.tabBar, { marginTop: 0 }]}>
          <TouchableOpacity
            style={[
              globalStyles.tabItem,
              activeSection === 'original' && globalStyles.tabItemActive,
            ]}
            onPress={() => setActiveSection('original')}
          >
            <Text
              style={[
                globalStyles.tabText,
                activeSection === 'original' && globalStyles.tabTextActive,
              ]}
            >
              Original
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.tabItem,
              activeSection === 'ai' && globalStyles.tabItemActive,
            ]}
            onPress={() => setActiveSection('ai')}
          >
            <Text
              style={[
                globalStyles.tabText,
                activeSection === 'ai' && globalStyles.tabTextActive,
              ]}
            >
              AI Suggestion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.tabItem,
              activeSection === 'decision' && globalStyles.tabItemActive,
            ]}
            onPress={() => setActiveSection('decision')}
          >
            <Text
              style={[
                globalStyles.tabText,
                activeSection === 'decision' && globalStyles.tabTextActive,
              ]}
            >
              Decision
            </Text>
          </TouchableOpacity>
        </View>

        {/* === ORIGINAL CONCERN TAB === */}
        {activeSection === 'original' && (
          <View style={{ paddingHorizontal: 20 }}>
            <View style={globalStyles.detailCard}>
              <Text style={globalStyles.label}>Original Stakeholder Concern</Text>
              <Text style={globalStyles.detailBodyText}>
                {concern.description}
              </Text>

              {/* Meta Grid */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: '600',
                      marginBottom: 4,
                    }}
                  >
                    SUBMITTED BY
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#0F172A',
                      fontWeight: '700',
                    }}
                  >
                    {concern.submittedBy}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: '600',
                      marginBottom: 4,
                    }}
                  >
                    DATE SUBMITTED
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#0F172A',
                      fontWeight: '700',
                    }}
                  >
                    {concern.dateSubmitted}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: '600',
                      marginBottom: 4,
                    }}
                  >
                    CATEGORY (USER)
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#0F172A',
                      fontWeight: '700',
                    }}
                  >
                    {concern.category}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontWeight: '600',
                      marginBottom: 4,
                    }}
                  >
                    DEPARTMENT
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#0F172A',
                      fontWeight: '700',
                    }}
                  >
                    {concern.department}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* === AI SUGGESTION TAB === */}
        {activeSection === 'ai' && (
          <View style={{ paddingHorizontal: 20 }}>
            {concern.aiSuggestedCategory ? (
              <>
                {/* AI Analysis Panel */}
                <View style={globalStyles.aiPanel}>
                  <View style={globalStyles.aiPanelHeader}>
                    <Ionicons name="sparkles" size={20} color="#10B981" />
                    <Text style={globalStyles.aiPanelTitle}>
                      AI-Generated Suggestions
                    </Text>
                  </View>

                  {/* Suggested Category */}
                  <View style={globalStyles.aiSuggestionRow}>
                    <Text style={globalStyles.aiSuggestionLabel}>
                      Suggested Category
                    </Text>
                    <Text style={globalStyles.aiSuggestionValue}>
                      {concern.aiSuggestedCategory}
                    </Text>
                  </View>

                  {/* Suggested Priority */}
                  <View style={globalStyles.aiSuggestionRow}>
                    <Text style={globalStyles.aiSuggestionLabel}>
                      Suggested Priority
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: concern.aiSuggestedPriority
                            ? PRIORITY_COLORS[concern.aiSuggestedPriority]
                            : '#94A3B8',
                        }}
                      />
                      <Text style={globalStyles.aiSuggestionValue}>
                        {concern.aiSuggestedPriority
                          ? PRIORITY_LABELS[concern.aiSuggestedPriority]
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Confidence */}
                  <View style={{ marginTop: 8 }}>
                    <View style={globalStyles.aiSuggestionRow}>
                      <Text style={globalStyles.aiSuggestionLabel}>
                        Confidence Score
                      </Text>
                      <Text style={globalStyles.aiSuggestionValue}>
                        {concern.aiConfidence}%
                      </Text>
                    </View>
                    <View style={globalStyles.aiConfidenceBar}>
                      <View
                        style={[
                          globalStyles.aiConfidenceFill,
                          { width: `${concern.aiConfidence || 0}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* AI Summary */}
                <View style={globalStyles.detailCard}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons
                      name="document-text"
                      size={16}
                      color="#10B981"
                    />
                    <Text style={globalStyles.label}>
                      AI-Generated Summary
                    </Text>
                  </View>
                  <Text style={globalStyles.detailBodyText}>
                    {concern.aiGeneratedSummary}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      fontStyle: 'italic',
                    }}
                  >
                    Note: This summary is AI-generated and should be verified by
                    authorized personnel.
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={{ gap: 10 }}>
                  <TouchableOpacity
                    style={[
                      globalStyles.button,
                      { backgroundColor: '#10B981', shadowColor: '#10B981' },
                    ]}
                    onPress={handleAcceptAI}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#FFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={globalStyles.buttonText}>
                      Accept AI Suggestion
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      globalStyles.button,
                      { backgroundColor: '#F59E0B', shadowColor: '#F59E0B' },
                    ]}
                    onPress={handleOverride}
                  >
                    <Ionicons
                      name="create"
                      size={20}
                      color="#FFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={globalStyles.buttonText}>
                      Edit / Override
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={globalStyles.buttonOutline}
                    onPress={handleManualFallback}
                  >
                    <Ionicons
                      name="hand-left-outline"
                      size={20}
                      color="#4F46E5"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={globalStyles.buttonOutlineText}>
                      Manual Fallback
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={globalStyles.emptyState}>
                <Ionicons name="sparkles-outline" size={48} color="#CBD5E1" />
                <Text style={globalStyles.emptyStateText}>
                  No AI suggestions available for this concern.{'\n'}
                  Use manual processing.
                </Text>
                <TouchableOpacity
                  style={[globalStyles.button, { marginTop: 16 }]}
                  onPress={handleManualFallback}
                >
                  <Text style={globalStyles.buttonText}>
                    Process Manually
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* === HUMAN DECISION TAB === */}
        {activeSection === 'decision' && (
          <View style={{ paddingHorizontal: 20 }}>
            {concern.confirmedCategory ? (
              <>
                <View style={globalStyles.humanDecisionPanel}>
                  <View style={globalStyles.humanDecisionHeader}>
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#4F46E5"
                    />
                    <Text style={globalStyles.humanDecisionTitle}>
                      Final Human Decision
                    </Text>
                  </View>

                  <View style={globalStyles.aiSuggestionRow}>
                    <Text style={[globalStyles.aiSuggestionLabel, { color: '#4338CA' }]}>
                      Confirmed Category
                    </Text>
                    <Text style={[globalStyles.aiSuggestionValue, { color: '#3730A3' }]}>
                      {concern.confirmedCategory}
                    </Text>
                  </View>

                  <View style={globalStyles.aiSuggestionRow}>
                    <Text style={[globalStyles.aiSuggestionLabel, { color: '#4338CA' }]}>
                      Confirmed Priority
                    </Text>
                    <Text style={[globalStyles.aiSuggestionValue, { color: '#3730A3' }]}>
                      {concern.confirmedPriority
                        ? PRIORITY_LABELS[concern.confirmedPriority]
                        : 'N/A'}
                    </Text>
                  </View>

                  <View style={globalStyles.aiSuggestionRow}>
                    <Text style={[globalStyles.aiSuggestionLabel, { color: '#4338CA' }]}>
                      Confirmed By
                    </Text>
                    <Text style={[globalStyles.aiSuggestionValue, { color: '#3730A3' }]}>
                      {concern.confirmedBy}
                    </Text>
                  </View>

                  <View style={globalStyles.aiSuggestionRow}>
                    <Text style={[globalStyles.aiSuggestionLabel, { color: '#4338CA' }]}>
                      Decision Date
                    </Text>
                    <Text style={[globalStyles.aiSuggestionValue, { color: '#3730A3' }]}>
                      {concern.confirmedDate || 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Comparison: AI vs Human */}
                {concern.aiSuggestedCategory && (
                  <View style={globalStyles.detailCard}>
                    <Text style={[globalStyles.label, { marginBottom: 14 }]}>
                      AI vs Human Decision Comparison
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 12,
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#F0FDF4',
                          borderRadius: 12,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: '#BBF7D0',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#15803D',
                            fontWeight: '700',
                            marginBottom: 6,
                          }}
                        >
                          AI SUGGESTION
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#166534',
                            fontWeight: '600',
                          }}
                        >
                          {concern.aiSuggestedCategory}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#15803D',
                            marginTop: 2,
                          }}
                        >
                          {concern.aiSuggestedPriority
                            ? PRIORITY_LABELS[concern.aiSuggestedPriority]
                            : ''}{' '}
                          Priority
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#EEF2FF',
                          borderRadius: 12,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: '#C7D2FE',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#4338CA',
                            fontWeight: '700',
                            marginBottom: 6,
                          }}
                        >
                          HUMAN DECISION
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#3730A3',
                            fontWeight: '600',
                          }}
                        >
                          {concern.confirmedCategory}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#4338CA',
                            marginTop: 2,
                          }}
                        >
                          {concern.confirmedPriority
                            ? PRIORITY_LABELS[concern.confirmedPriority]
                            : ''}{' '}
                          Priority
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor:
                          concern.aiSuggestedCategory === concern.confirmedCategory
                            ? '#F0FDF4'
                            : '#FEF2F2',
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Ionicons
                        name={
                          concern.aiSuggestedCategory === concern.confirmedCategory
                            ? 'checkmark-circle'
                            : 'alert-circle'
                        }
                        size={16}
                        color={
                          concern.aiSuggestedCategory === concern.confirmedCategory
                            ? '#10B981'
                            : '#EF4444'
                        }
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color:
                            concern.aiSuggestedCategory ===
                            concern.confirmedCategory
                              ? '#15803D'
                              : '#DC2626',
                        }}
                      >
                        {concern.aiSuggestedCategory === concern.confirmedCategory
                          ? 'AI suggestion matches human decision'
                          : 'Human overrode AI suggestion'}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={globalStyles.emptyState}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={48}
                  color="#CBD5E1"
                />
                <Text style={globalStyles.emptyStateText}>
                  No final decision has been made yet.{'\n'}
                  Review the AI suggestion tab to make a decision.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Status Timeline */}
        <View style={[globalStyles.detailCard, { marginHorizontal: 20, marginTop: 16 }]}>
          <Text style={[globalStyles.label, { marginBottom: 16 }]}>
            Status Timeline
          </Text>
          {concern.statusHistory.map((update, index) => (
            <View key={index} style={globalStyles.timelineItem}>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={[
                    globalStyles.timelineDot,
                    { backgroundColor: STATUS_COLORS[update.status] },
                  ]}
                />
                {index < concern.statusHistory.length - 1 && (
                  <View style={globalStyles.timelineLine} />
                )}
              </View>
              <View style={globalStyles.timelineContent}>
                <Text style={globalStyles.timelineStatus}>
                  {STATUS_LABELS[update.status]}
                </Text>
                <Text style={globalStyles.timelineDate}>
                  {update.date} • by {update.updatedBy}
                </Text>
                {update.note && (
                  <Text style={globalStyles.timelineNote}>{update.note}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
