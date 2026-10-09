import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import { BottomNavBar } from '../components/BottomNavBar';
import { MOCK_ANNOUNCEMENTS } from '../constants/connectHubData';

export default function AnnouncementsScreen() {
  const pinnedItems = MOCK_ANNOUNCEMENTS.filter((a) => a.isPinned && a.isActive);
  const regularItems = MOCK_ANNOUNCEMENTS.filter(
    (a) => !a.isPinned && a.isActive
  );

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
            <Text style={globalStyles.brandTitle}>Announcements</Text>
            <Text style={globalStyles.brandSub}>
              Latest updates & advisories
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Pinned Section */}
        {pinnedItems.length > 0 && (
          <>
            <View style={globalStyles.sectionTitleRow}>
              <Text style={globalStyles.sectionTitle}>📌 Pinned</Text>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              {pinnedItems.map((item) => (
                <View key={item.id} style={globalStyles.announcementCard}>
                  <View style={globalStyles.pinnedBadge}>
                    <Ionicons name="pin" size={10} color="#92400E" />
                    <Text style={globalStyles.pinnedBadgeText}>Pinned</Text>
                  </View>
                  <View
                    style={[
                      globalStyles.announcementTypeBadge,
                      {
                        backgroundColor:
                          item.type === 'advisory' ? '#FEF2F2' : '#EEF2FF',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        globalStyles.statusBadgeText,
                        {
                          color:
                            item.type === 'advisory' ? '#DC2626' : '#4F46E5',
                        },
                      ]}
                    >
                      {item.type === 'advisory'
                        ? '⚠ Advisory'
                        : '📢 Announcement'}
                    </Text>
                  </View>
                  <Text style={globalStyles.announcementTitle}>
                    {item.title}
                  </Text>
                  <Text style={globalStyles.announcementSnippet}>
                    {item.content}
                  </Text>
                  <View style={globalStyles.announcementMeta}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name="business-outline"
                        size={14}
                        color="#94A3B8"
                      />
                      <Text style={{ color: '#64748B', fontSize: 12 }}>
                        {item.department}
                      </Text>
                    </View>
                    <Text style={{ color: '#94A3B8', fontSize: 12 }}>
                      {item.datePublished}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Regular Announcements */}
        <View style={globalStyles.sectionTitleRow}>
          <Text style={globalStyles.sectionTitle}>Recent</Text>
          <Text style={globalStyles.sectionLink}>
            {regularItems.length} items
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          {regularItems.map((item) => (
            <View key={item.id} style={globalStyles.announcementCard}>
              <View
                style={[
                  globalStyles.announcementTypeBadge,
                  {
                    backgroundColor:
                      item.type === 'advisory' ? '#FEF2F2' : '#EEF2FF',
                  },
                ]}
              >
                <Text
                  style={[
                    globalStyles.statusBadgeText,
                    {
                      color:
                        item.type === 'advisory' ? '#DC2626' : '#4F46E5',
                    },
                  ]}
                >
                  {item.type === 'advisory'
                    ? '⚠ Advisory'
                    : '📢 Announcement'}
                </Text>
              </View>
              <Text style={globalStyles.announcementTitle}>{item.title}</Text>
              <Text style={globalStyles.announcementSnippet}>
                {item.content}
              </Text>
              <View style={globalStyles.announcementMeta}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color="#94A3B8"
                  />
                  <Text style={{ color: '#64748B', fontSize: 12 }}>
                    {item.author}
                  </Text>
                </View>
                <Text style={{ color: '#94A3B8', fontSize: 12 }}>
                  {item.datePublished}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar variant="stakeholder" />
    </SafeAreaView>
  );
}
