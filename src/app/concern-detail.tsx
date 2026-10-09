import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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

export default function ConcernDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const concern =
    MOCK_CONCERNS.find((c) => c.id === id) || MOCK_CONCERNS[0];

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
            <Text style={globalStyles.brandTitle}>Concern Details</Text>
            <Text style={globalStyles.brandSub}>ID: {concern.id}</Text>
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
            { backgroundColor: STATUS_COLORS[concern.status] },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={globalStyles.badgeTag}>
              <Text style={globalStyles.badgeTagText}>
                {STATUS_LABELS[concern.status]}
              </Text>
            </View>
            <View style={globalStyles.badgeTag}>
              <Text style={globalStyles.badgeTagText}>
                {PRIORITY_LABELS[concern.priority]} Priority
              </Text>
            </View>
          </View>

          <Text style={globalStyles.detailTitle} numberOfLines={3}>
            {concern.title}
          </Text>
        </View>

        {/* Concern Info Card */}
        <View style={globalStyles.detailCard}>
          <Text style={globalStyles.label}>Description</Text>
          <Text style={globalStyles.detailBodyText}>
            {concern.description}
          </Text>

          {/* Meta Grid */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#F8FAFC',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4 }}>
                CATEGORY
              </Text>
              <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '700' }}>
                {concern.category}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#F8FAFC',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4 }}>
                DEPARTMENT
              </Text>
              <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '700' }}>
                {concern.department}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#F8FAFC',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4 }}>
                SUBMITTED
              </Text>
              <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '700' }}>
                {concern.dateSubmitted}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#F8FAFC',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4 }}>
                LAST UPDATED
              </Text>
              <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '700' }}>
                {concern.lastUpdated}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={globalStyles.detailCard}>
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

        {/* Responses */}
        {concern.responses.length > 0 && (
          <View style={globalStyles.detailCard}>
            <Text style={[globalStyles.label, { marginBottom: 12 }]}>
              Responses ({concern.responses.length})
            </Text>
            {concern.responses.map((response) => (
              <View
                key={response.id}
                style={[
                  globalStyles.responseBubble,
                  response.fromRole === 'admin' && globalStyles.responseBubbleAdmin,
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <View
                    style={[
                      globalStyles.miniAvatar,
                      {
                        backgroundColor:
                          response.fromRole === 'admin' ? '#4F46E5' : '#10B981',
                      },
                    ]}
                  >
                    <Text style={globalStyles.miniAvatarText}>
                      {response.from
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </Text>
                  </View>
                  <Text style={globalStyles.responseFrom}>{response.from}</Text>
                  {response.fromRole === 'admin' && (
                    <View
                      style={{
                        backgroundColor: '#EEF2FF',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: '700',
                          color: '#4F46E5',
                        }}
                      >
                        ADMIN
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={globalStyles.responseMessage}>
                  {response.message}
                </Text>
                <Text style={globalStyles.responseDate}>{response.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={[globalStyles.buttonOutline, { marginHorizontal: 20 }]}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back-outline"
            size={20}
            color="#4F46E5"
            style={{ marginRight: 8 }}
          />
          <Text style={globalStyles.buttonOutlineText}>Back to Concerns</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
