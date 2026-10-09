import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { BottomNavBar } from '../components/BottomNavBar';
import { EmergencySOS } from '../components/EmergencySOS';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_CONCERNS,
  MOCK_CURRENT_USER,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../constants/connectHubData';

export default function HomeScreen() {
  const user = MOCK_CURRENT_USER;
  const userConcerns = MOCK_CONCERNS.filter((c) => c.submittedBy === user.name);
  const pendingCount = userConcerns.filter((c) => c.status === 'pending').length;
  const inProgressCount = userConcerns.filter(
    (c) => c.status === 'in-progress' || c.status === 'under-review'
  ).length;
  const resolvedCount = userConcerns.filter((c) => c.status === 'resolved').length;
  const recentAnnouncements = MOCK_ANNOUNCEMENTS.filter((a) => a.isActive).slice(0, 3);

  // Greeting by time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

      {/* ── Hero Header ── */}
      <View style={s.heroHeader}>
        <View style={s.heroTop}>
          <View>
            <Text style={s.heroGreeting}>{greeting} 👋</Text>
            <Text style={s.heroName}>{user.name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity
            style={s.heroAvatar}
            onPress={() => router.push('/profile' as Href)}
          >
            <Text style={s.heroAvatarText}>{user.avatar}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={s.heroStats}>
          <View style={s.heroStat}>
            <Ionicons name="time-outline" size={16} color="#FDE68A" />
            <Text style={s.heroStatNum}>{pendingCount}</Text>
            <Text style={s.heroStatLabel}>Pending</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Ionicons name="sync-outline" size={16} color="#93C5FD" />
            <Text style={s.heroStatNum}>{inProgressCount}</Text>
            <Text style={s.heroStatLabel}>In Progress</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#6EE7B7" />
            <Text style={s.heroStatNum}>{resolvedCount}</Text>
            <Text style={s.heroStatLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Quick Actions ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={s.quickActions}>
          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#EEF2FF' }]}
            onPress={() => router.push('/submit-concern' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#4F46E5' }]}>
              <Ionicons name="chatbox-ellipses" size={22} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#3730A3' }]}>Submit{'\n'}Concern</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#F0FDF4' }]}
            onPress={() => router.push('/my-concerns' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#10B981' }]}>
              <Ionicons name="document-text" size={22} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#065F46' }]}>Track{'\n'}Concerns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#FFFBEB' }]}
            onPress={() => router.push('/announcements' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="megaphone" size={22} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#92400E' }]}>View{'\n'}News</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#F0F9FF' }]}
            onPress={() => router.push('/notifications' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#0EA5E9' }]}>
              <Ionicons name="notifications" size={22} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#0C4A6E' }]}>My{'\n'}Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* ── Pinned Announcements ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Announcements</Text>
          <TouchableOpacity onPress={() => router.push('/announcements' as Href)}>
            <Text style={s.sectionLink}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {recentAnnouncements.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.annoCard}
              activeOpacity={0.88}
              onPress={() => router.push('/announcements' as Href)}
            >
              {item.isPinned && (
                <View style={s.pinnedBadge}>
                  <Ionicons name="pin" size={10} color="#92400E" />
                  <Text style={s.pinnedBadgeText}>Pinned</Text>
                </View>
              )}
              <View
                style={[
                  s.annoTypeBadge,
                  { backgroundColor: item.type === 'advisory' ? '#FEF2F2' : '#EEF2FF' },
                ]}
              >
                <Text
                  style={[
                    s.annoTypeBadgeText,
                    { color: item.type === 'advisory' ? '#DC2626' : '#4F46E5' },
                  ]}
                >
                  {item.type === 'advisory' ? '⚠ Advisory' : '📢 Announcement'}
                </Text>
              </View>
              <Text style={s.annoTitle}>{item.title}</Text>
              <Text style={s.annoSnippet} numberOfLines={2}>{item.content}</Text>
              <View style={s.annoMeta}>
                <Text style={s.annoMetaText}>{item.department}</Text>
                <Text style={s.annoMetaDate}>{item.datePublished}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── My Recent Concerns ── */}
        <View style={[s.sectionRow, { marginTop: 8 }]}>
          <Text style={s.sectionTitle}>My Concerns</Text>
          <TouchableOpacity onPress={() => router.push('/my-concerns' as Href)}>
            <Text style={s.sectionLink}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {userConcerns.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="document-outline" size={48} color="#CBD5E1" />
              <Text style={s.emptyText}>No concerns submitted yet</Text>
              <TouchableOpacity
                style={s.emptyBtn}
                onPress={() => router.push('/submit-concern' as Href)}
              >
                <Text style={s.emptyBtnText}>Submit your first concern →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            userConcerns.slice(0, 3).map((concern) => (
              <TouchableOpacity
                key={concern.id}
                style={s.concernCard}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: '/concern-detail' as any,
                    params: { id: concern.id },
                  })
                }
              >
                <View style={s.concernCardTop}>
                  <Text style={s.concernTitle} numberOfLines={2}>{concern.title}</Text>
                  <View
                    style={[s.statusBadge, { backgroundColor: STATUS_COLORS[concern.status] + '20' }]}
                  >
                    <Text style={[s.statusBadgeText, { color: STATUS_COLORS[concern.status] }]}>
                      {STATUS_LABELS[concern.status]}
                    </Text>
                  </View>
                </View>
                <View style={s.concernMeta}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="folder-outline" size={12} color="#94A3B8" />
                    <Text style={s.concernMetaText}>{concern.category}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                    <Text style={s.concernMetaText}>{concern.dateSubmitted}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar variant="stakeholder" />
      <EmergencySOS />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // Hero Header
  heroHeader: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  heroGreeting: { fontSize: 13, color: '#A5B4FC', fontWeight: '600' },
  heroName: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  heroAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroAvatarText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  heroStat: { alignItems: 'center', gap: 4 },
  heroStatNum: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  heroStatLabel: {
    fontSize: 10,
    color: '#A5B4FC',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Sections
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  sectionLink: { fontSize: 13, color: '#4F46E5', fontWeight: '700' },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  qaCard: {
    flex: 1,
    borderRadius: 18,
    padding: 13,
    alignItems: 'flex-start',
    minHeight: 105,
  },
  qaIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  qaLabel: {
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 16,
  },

  // Announcement cards
  annoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pinnedBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400E', textTransform: 'uppercase' },
  annoTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  annoTypeBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  annoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 21,
  },
  annoSnippet: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  annoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  annoMetaText: { fontSize: 12, color: '#64748B' },
  annoMetaDate: { fontSize: 12, color: '#94A3B8' },

  // Concern Cards
  concernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  concernCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  concernTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexShrink: 0,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  concernMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-between',
  },
  concernMetaText: { fontSize: 11, color: '#64748B' },

  // Empty state
  emptyState: { alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 14, color: '#94A3B8', marginTop: 12, marginBottom: 16 },
  emptyBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyBtnText: { color: '#4F46E5', fontSize: 13, fontWeight: '700' },
});