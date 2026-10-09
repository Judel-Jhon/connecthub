import React, { useState } from 'react';
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
import {
  MOCK_CONCERNS,
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  ConcernStatus,
} from '../constants/connectHubData';

const STATUS_FILTERS: { label: string; value: ConcernStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
];

export default function MyConcernsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<ConcernStatus | 'all'>('all');

  const filteredConcerns =
    selectedFilter === 'all'
      ? MOCK_CONCERNS
      : MOCK_CONCERNS.filter((c) => c.status === selectedFilter);

  const counts: Record<ConcernStatus | 'all', number> = {
    all: MOCK_CONCERNS.length,
    pending: MOCK_CONCERNS.filter((c) => c.status === 'pending').length,
    'under-review': MOCK_CONCERNS.filter((c) => c.status === 'under-review').length,
    'in-progress': MOCK_CONCERNS.filter((c) => c.status === 'in-progress').length,
    resolved: MOCK_CONCERNS.filter((c) => c.status === 'resolved').length,
    rejected: MOCK_CONCERNS.filter((c) => c.status === 'rejected').length,
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

      {/* ── Hero Header ── */}
      <View style={s.heroHeader}>
        <View style={s.heroTop}>
          <View>
            <Text style={s.heroTitle}>My Concerns</Text>
            <Text style={s.heroSub}>Track & monitor your submissions</Text>
          </View>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => router.push('/submit-concern' as Href)}
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Summary chips */}
        <View style={s.summaryRow}>
          {[
            { label: 'Total', count: MOCK_CONCERNS.length, color: '#A5B4FC' },
            { label: 'Active', count: counts['in-progress'] + counts['under-review'], color: '#93C5FD' },
            { label: 'Pending', count: counts['pending'], color: '#FDE68A' },
            { label: 'Done', count: counts['resolved'], color: '#6EE7B7' },
          ].map((item) => (
            <View key={item.label} style={s.summaryChip}>
              <Text style={[s.summaryNum, { color: item.color }]}>{item.count}</Text>
              <Text style={s.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Filter Pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = selectedFilter === filter.value;
          const statusColor =
            filter.value === 'pending' ? '#F59E0B' :
            filter.value === 'under-review' ? '#6366F1' :
            filter.value === 'in-progress' ? '#0EA5E9' :
            filter.value === 'resolved' ? '#10B981' : '#4F46E5';

          return (
            <TouchableOpacity
              key={filter.value}
              style={[
                s.filterPill,
                isActive && { backgroundColor: statusColor, borderColor: statusColor },
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text style={[s.filterText, isActive && { color: '#FFF' }]}>
                {filter.label}
              </Text>
              <View style={[s.filterBadge, isActive && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                <Text style={[s.filterBadgeText, isActive && { color: '#FFF' }]}>
                  {counts[filter.value]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Section header */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>
            {selectedFilter === 'all' ? 'All Concerns' : STATUS_LABELS[selectedFilter as ConcernStatus]}
          </Text>
          <Text style={s.sectionCount}>{filteredConcerns.length} items</Text>
        </View>

        {/* Cards */}
        <View style={{ paddingHorizontal: 20 }}>
          {filteredConcerns.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="document-text-outline" size={56} color="#CBD5E1" />
              <Text style={s.emptyTitle}>Nothing here yet</Text>
              <Text style={s.emptyText}>No concerns found for this filter</Text>
              <TouchableOpacity
                style={s.emptyBtn}
                onPress={() => router.push('/submit-concern' as Href)}
              >
                <Ionicons name="add-circle-outline" size={16} color="#4F46E5" />
                <Text style={s.emptyBtnText}>Submit a concern</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredConcerns.map((concern) => (
              <TouchableOpacity
                key={concern.id}
                style={s.card}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: '/concern-detail' as any,
                    params: { id: concern.id },
                  })
                }
              >
                {/* Left accent */}
                <View style={[s.cardAccent, { backgroundColor: STATUS_COLORS[concern.status] }]} />
                <View style={s.cardBody}>
                  {/* Badges row */}
                  <View style={s.badgeRow}>
                    <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[concern.status] + '20' }]}>
                      <Text style={[s.statusBadgeText, { color: STATUS_COLORS[concern.status] }]}>
                        {STATUS_LABELS[concern.status]}
                      </Text>
                    </View>
                    <View style={[s.priorityBadge, { backgroundColor: PRIORITY_COLORS[concern.priority] + '20' }]}>
                      <Text style={[s.priorityBadgeText, { color: PRIORITY_COLORS[concern.priority] }]}>
                        {PRIORITY_LABELS[concern.priority]}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={s.cardTitle} numberOfLines={2}>{concern.title}</Text>

                  {/* Description snippet */}
                  <Text style={s.cardDesc} numberOfLines={2}>{concern.description}</Text>

                  {/* Meta */}
                  <View style={s.cardMeta}>
                    <View style={s.cardMetaItem}>
                      <Ionicons name="folder-outline" size={12} color="#94A3B8" />
                      <Text style={s.cardMetaText}>{concern.category}</Text>
                    </View>
                    <View style={s.cardMetaItem}>
                      <Ionicons name="business-outline" size={12} color="#94A3B8" />
                      <Text style={s.cardMetaText}>{concern.department}</Text>
                    </View>
                    <View style={s.cardMetaItem}>
                      <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                      <Text style={s.cardMetaText}>{concern.dateSubmitted}</Text>
                    </View>
                  </View>

                  {/* Responses count */}
                  {concern.responses.length > 0 && (
                    <View style={s.responseRow}>
                      <Ionicons name="chatbubble-ellipses" size={13} color="#4F46E5" />
                      <Text style={s.responseText}>
                        {concern.responses.length} response{concern.responses.length > 1 ? 's' : ''}
                      </Text>
                      <Ionicons name="chevron-forward" size={13} color="#4F46E5" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar variant="stakeholder" />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // Hero
  heroHeader: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  heroSub: { fontSize: 12, color: '#A5B4FC', marginTop: 2, fontWeight: '500' },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // Summary chips
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  summaryChip: { alignItems: 'center' },
  summaryNum: { fontSize: 20, fontWeight: '900' },
  summaryLabel: {
    fontSize: 10,
    color: '#A5B4FC',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Filter
  filterScroll: { paddingVertical: 16 },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    flexShrink: 0,
  },
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  filterBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 22,
    alignItems: 'center',
  },
  filterBadgeText: { fontSize: 11, fontWeight: '800', color: '#64748B' },

  // Section
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionCount: { fontSize: 13, color: '#64748B', fontWeight: '600' },

  // Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, padding: 14 },

  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },

  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', lineHeight: 20, marginBottom: 6 },
  cardDesc: { fontSize: 12, color: '#64748B', lineHeight: 17, marginBottom: 10 },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexWrap: 'wrap',
  },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11, color: '#64748B' },

  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  responseText: { fontSize: 12, color: '#4F46E5', fontWeight: '700' },

  // Empty state
  emptyState: { alignItems: 'center', padding: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 4 },
  emptyText: { fontSize: 14, color: '#94A3B8', marginBottom: 20 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyBtnText: { color: '#4F46E5', fontSize: 13, fontWeight: '700' },
});
