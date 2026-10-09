import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNavBar } from '../components/BottomNavBar';
import {
  MOCK_CONCERNS,
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  ConcernStatus,
} from '../constants/connectHubData';

const ADMIN_FILTERS: { label: string; value: ConcernStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AdminConcernsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<ConcernStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredConcerns = MOCK_CONCERNS.filter((c) => {
    const matchesFilter = selectedFilter === 'all' || c.status === selectedFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      <StatusBar barStyle="light-content" backgroundColor="#3730A3" />

      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Concern Queue</Text>
          <Text style={s.headerSub}>Review & manage all stakeholder concerns</Text>
        </View>
        <View style={s.headerBadge}>
          <Text style={s.headerBadgeText}>{MOCK_CONCERNS.length}</Text>
        </View>
      </View>

      {/* ── Search ── */}
      <View style={[s.searchWrap, searchFocused && s.searchWrapFocused]}>
        <Ionicons name="search-outline" size={20} color={searchFocused ? '#4F46E5' : '#94A3B8'} />
        <TextInput
          style={s.searchInput}
          placeholder="Search by title, person, or category…"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Filter Pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {ADMIN_FILTERS.map((filter) => {
            const isActive = selectedFilter === filter.value;
            const statusColor =
              filter.value === 'pending' ? '#F59E0B' :
              filter.value === 'under-review' ? '#6366F1' :
              filter.value === 'in-progress' ? '#0EA5E9' :
              filter.value === 'resolved' ? '#10B981' :
              filter.value === 'rejected' ? '#EF4444' : '#4F46E5';

            return (
              <TouchableOpacity
                key={filter.value}
                style={[
                  s.filterPill,
                  isActive && { backgroundColor: statusColor, borderColor: statusColor },
                ]}
                onPress={() => setSelectedFilter(filter.value)}
              >
                <Text style={[s.filterPillText, isActive && { color: '#FFF' }]}>
                  {filter.label}
                </Text>
                <View style={[s.filterPillBadge, isActive && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                  <Text style={[s.filterPillBadgeText, isActive && { color: '#FFF' }]}>
                    {counts[filter.value]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Results Header ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>
            {selectedFilter === 'all' ? 'All Concerns' : STATUS_LABELS[selectedFilter as ConcernStatus]}
          </Text>
          <Text style={s.sectionCount}>{filteredConcerns.length} items</Text>
        </View>

        {/* ── Cards ── */}
        <View style={{ paddingHorizontal: 20 }}>
          {filteredConcerns.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={52} color="#CBD5E1" />
              <Text style={s.emptyTitle}>No Results</Text>
              <Text style={s.emptyText}>No concerns match your search or filter.</Text>
            </View>
          ) : (
            filteredConcerns.map((concern) => (
              <TouchableOpacity
                key={concern.id}
                style={s.card}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: '/admin-review' as any,
                    params: { id: concern.id },
                  })
                }
              >
                {/* Left accent bar */}
                <View style={[s.cardAccent, { backgroundColor: STATUS_COLORS[concern.status] }]} />
                <View style={s.cardBody}>
                  {/* Status + Priority row */}
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
                    {concern.aiSuggestedCategory && (
                      <View style={s.aiBadge}>
                        <Ionicons name="sparkles" size={11} color="#10B981" />
                        <Text style={s.aiBadgeText}>AI</Text>
                      </View>
                    )}
                  </View>

                  {/* Title */}
                  <Text style={s.cardTitle} numberOfLines={2}>{concern.title}</Text>

                  {/* Meta */}
                  <View style={s.cardMeta}>
                    <View style={s.cardMetaItem}>
                      <View style={s.miniAvatar}>
                        <Text style={s.miniAvatarText}>{concern.submitterAvatar}</Text>
                      </View>
                      <Text style={s.cardMetaText}>{concern.submittedBy}</Text>
                    </View>
                    <View style={s.cardMetaItem}>
                      <Ionicons name="folder-outline" size={12} color="#94A3B8" />
                      <Text style={s.cardMetaText}>{concern.category}</Text>
                    </View>
                    <View style={s.cardMetaItem}>
                      <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                      <Text style={s.cardMetaText}>{concern.dateSubmitted}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                  </View>

                  {/* AI suggestion detail */}
                  {concern.aiSuggestedCategory && (
                    <View style={s.aiDetail}>
                      <Ionicons name="sparkles" size={12} color="#10B981" />
                      <Text style={s.aiDetailText}>
                        AI: {concern.aiSuggestedCategory} · {concern.aiConfidence}% confidence
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar variant="admin" />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: '#A5B4FC', marginTop: 2, fontWeight: '500' },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerBadgeText: { color: '#FFF', fontWeight: '900', fontSize: 16 },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  searchWrapFocused: {
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.15,
  },
  searchInput: { flex: 1, color: '#0F172A', fontSize: 15 },

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
  filterPillText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  filterPillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 22,
    alignItems: 'center',
  },
  filterPillBadgeText: { fontSize: 11, fontWeight: '800', color: '#64748B' },

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

  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  aiBadgeText: { fontSize: 10, fontWeight: '800', color: '#10B981' },

  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', lineHeight: 20, marginBottom: 10 },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexWrap: 'wrap',
  },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11, color: '#64748B' },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: { fontSize: 8, fontWeight: '800', color: '#4F46E5' },

  aiDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  aiDetailText: { fontSize: 11, color: '#15803D', fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 4 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});
