import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PackageCard from '@/components/PackageCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAllPackages } from '@/services/package.service';
import { useAuth } from '@/store/auth-context';
import { useRoute } from '@/store/route-context';
import type { Package } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { packages, loadPackages, setLoading, setError, pendingCount, deliveredCount, isLoading: isContextLoading } = useRoute();
  
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isDark = scheme === 'dark';

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');

  const fetchPackages = async () => {
    try {
      setLoading();
      const data = await getAllPackages();
      loadPackages(data);
    } catch (err) {
      setError('Failed to fetch packages');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPackages();
    setRefreshing(false);
  };

  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return pkg.status === 'pending';
    if (filter === 'delivered') return pkg.status === 'delivered';
    return true;
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: c.tint }]}>
          <Text style={styles.statNumber}>{packages.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#F59E0B' }]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#10B981' }]}>
          <Text style={styles.statNumber}>{deliveredCount}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={() => router.push('/package/smart-scan')}
        >
          <Ionicons name="scan" size={24} color={c.tint} />
          <Text style={[styles.actionBtnText, { color: c.text }]}>Smart Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={() => router.push('/map')}
        >
          <Ionicons name="map" size={24} color={c.tint} />
          <Text style={[styles.actionBtnText, { color: c.text }]}>View Map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'pending', 'delivered'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              filter === f && { backgroundColor: c.tint, borderColor: c.tint },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === f ? { color: '#FFF' } : { color: c.text },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <View style={[styles.topBar, { backgroundColor: c.tint }]}>
        <Text style={styles.title}>Welcome, {session?.driver.name.split(' ')[0]}</Text>
        <Text style={styles.subtitle}>Your Route Overview</Text>
      </View>

      {isContextLoading && !refreshing && packages.length === 0 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={c.tint} />
        </View>
      ) : (
        <FlatList
          data={filteredPackages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PackageCard pkg={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                No packages found for this filter.
              </Text>
            </View>
          }
          // Optimization per requirements
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});
