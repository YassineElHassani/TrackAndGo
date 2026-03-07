import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getPackageById } from '@/services/package.service';
import type { Package } from '@/types';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#D97706' },
  delivered: { label: 'Delivered', color: '#16A34A' },
  failed:    { label: 'Failed',    color: '#DC2626' },
} satisfies Record<string, { label: string; color: string }>;

export default function PackageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isDark = scheme === 'dark';

  const [pkg, setPkg] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPackageById(id)
      .then(setPkg)
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not load package.';
        Alert.alert('Error', message, [{ text: 'Go back', onPress: () => router.back() }]);
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={c.tint} />
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={[styles.loadingText, { color: c.icon }]}>Package not found.</Text>
      </View>
    );
  }

  const statusCfg = STATUS_CONFIG[pkg.status];
  const scheduledDate = new Date(pkg.scheduledTime).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Screen options={{ title: pkg.trackingNumber, headerStyle: { backgroundColor: c.background }, headerTintColor: c.text, headerShadowVisible: false }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.statusBanner, { backgroundColor: statusCfg.color + '18' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
          <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
          <Text style={[styles.sectionHeading, { color: c.icon }]}>RECIPIENT</Text>
          <Text style={[styles.recipientName, { color: c.text }]}>{pkg.recipientName}</Text>
          {pkg.recipientPhone && <Text style={[styles.meta, { color: c.icon }]}>{pkg.recipientPhone}</Text>}
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Text style={[styles.sectionHeading, { color: c.icon }]}>DELIVERY ADDRESS</Text>
          <Text style={[styles.bodyText, { color: c.text }]}>{pkg.address}</Text>
          <Text style={[styles.meta, { color: c.icon }]}>{pkg.city}</Text>
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Text style={[styles.sectionHeading, { color: c.icon }]}>SCHEDULED</Text>
          <Text style={[styles.bodyText, { color: c.text }]}>{scheduledDate}</Text>
          {pkg.deliveredAt && (<><View style={[styles.divider, { backgroundColor: c.border }]} /><Text style={[styles.sectionHeading, { color: c.icon }]}>DELIVERED AT</Text><Text style={[styles.bodyText, { color: c.text }]}>{new Date(pkg.deliveredAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</Text></>)}
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <View style={styles.metaRow}>
            <View style={styles.metaCol}><Text style={[styles.sectionHeading, { color: c.icon }]}>TRACKING NO.</Text><Text style={[styles.bodyText, { color: c.text }]}>{pkg.trackingNumber}</Text></View>
            {pkg.weight !== undefined && (<View style={styles.metaCol}><Text style={[styles.sectionHeading, { color: c.icon }]}>WEIGHT</Text><Text style={[styles.bodyText, { color: c.text }]}>{pkg.weight} kg</Text></View>)}
          </View>
          {pkg.deliveryInstructions && (<><View style={[styles.divider, { backgroundColor: c.border }]} /><Text style={[styles.sectionHeading, { color: c.icon }]}>INSTRUCTIONS</Text><Text style={[styles.bodyText, { color: c.icon }]}>{pkg.deliveryInstructions}</Text></>)}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
      {pkg.status === 'pending' && (
        <View style={[styles.actionBar, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
          <Pressable style={({ pressed }) => [styles.actionBtn, styles.incidentBtn, pressed && styles.btnPressed]} onPress={() => router.push(`/package/incident?packageId=${pkg.id}`)}>
            <Text style={styles.incidentBtnText}>Report Incident</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionBtn, { backgroundColor: c.tint }, pressed && styles.btnPressed]} onPress={() => router.push(`/package/smart-scan?packageId=${pkg.id}`)}>
            <Text style={styles.primaryBtnText}>Scan & Confirm</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  card: { margin: 16, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 20, gap: 4, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }) },
  sectionHeading: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 4 },
  recipientName: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
  bodyText: { fontSize: 15, fontWeight: '500' },
  meta: { fontSize: 13, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 16 },
  metaRow: { flexDirection: 'row', gap: 24 },
  metaCol: { flex: 1 },
  bottomSpacer: { height: 110 },
  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, ...Platform.select({ ios: { paddingBottom: 32 }, android: { paddingBottom: 16 }, default: { paddingBottom: 16 } }) },
  actionBtn: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  incidentBtn: { borderWidth: 1.5, borderColor: '#DC2626' },
  incidentBtnText: { color: '#DC2626', fontWeight: '700', fontSize: 15 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnPressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
});
