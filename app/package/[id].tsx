import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


export type Asset = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  previewUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
};


export default function PackageDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string; asset?: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';

  const c = Colors[scheme];
  const isDark = scheme === 'dark';

  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (params.asset) {
      try {
        setAsset(JSON.parse(params.asset));
      } catch {
        console.error('[PackageDetails] Failed to parse asset param');
      }
    } else {

      setAsset({
        id: params.id ?? '1',
        sellerId: 'user-123',
        title: `Package ${params.id ?? '1'}`,
        description:
          'This is where the package description will appear. It can describe what is included, the features, and any other relevant information about this package.',
        category: 'Electronics',
        price: 99.99,
        previewUrl: 'https://picsum.photos/seed/package/800/400',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      });
    }
  }, [params.id, params.asset]);



  if (!asset) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={[styles.loadingText, { color: c.icon }]}>Loading…</Text>
      </View>
    );
  }

  const formattedDate = new Date(asset.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <Stack.Screen
        options={{
          title: asset.title,
          headerStyle: { backgroundColor: c.background },
          headerTintColor: c.text,
          headerShadowVisible: false,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Image
          source={{ uri: asset.previewUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
              borderColor: isDark ? '#2c2c2e' : '#e5e5ea',
            },
          ]}
        >
          
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: c.tint + '22' }]}>
              <Text style={[styles.badgeText, { color: c.tint }]}>
                {asset.category.toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    asset.status === 'ACTIVE' ? '#34C75922' : '#FF3B3022',
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: asset.status === 'ACTIVE' ? '#34C759' : '#FF3B30' },
                ]}
              >
                {asset.status}
              </Text>
            </View>
          </View>

         
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: c.text }]}
              numberOfLines={2}
            >
              {asset.title}
            </Text>
            <Text style={[styles.price, { color: c.tint }]}>
              ${asset.price.toFixed(2)}
            </Text>
          </View>

          <View
            style={[
              styles.metaStrip,
              {
                borderTopColor: isDark ? '#2c2c2e' : '#e5e5ea',
                borderBottomColor: isDark ? '#2c2c2e' : '#e5e5ea',
              },
            ]}
          >
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: c.icon }]}>Listed on</Text>
              <Text style={[styles.metaValue, { color: c.text }]}>
                {formattedDate}
              </Text>
            </View>
            <View
              style={[
                styles.metaDivider,
                { backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea' },
              ]}
            />
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: c.icon }]}>Seller</Text>
              <Text
                style={[styles.metaValue, { color: c.text }]}
                numberOfLines={1}
              >
                {asset.sellerId}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: c.text }]}>
              About this package
            </Text>
            <Text style={[styles.description, { color: c.icon }]}>
              {asset.description}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View
        style={[
          styles.purchaseBar,
          {
            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
            borderTopColor: isDark ? '#2c2c2e' : '#e5e5ea',
          },
        ]}
      >
        <View style={styles.purchaseBarInner}>
          <View>
            <Text style={[styles.totalLabel, { color: c.icon }]}>Total price</Text>
            <Text style={[styles.totalAmount, { color: c.text }]}>
              ${asset.price.toFixed(2)}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.buyButton,
              { backgroundColor: c.tint },
              asset.status !== 'ACTIVE' && styles.buyButtonDisabled,
              pressed && styles.buyButtonPressed,
            ]}
            disabled={asset.status !== 'ACTIVE'}
            onPress={() => {
              console.log('[PackageDetails] Purchase pressed – asset id:', asset.id);
            }}
          >
            <Text style={styles.buyButtonText}>
              {asset.status === 'ACTIVE' ? 'Purchase Now' : 'Unavailable'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },

  
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  image: {
    width: '100%',
    height: 260,
    backgroundColor: '#cccccc',
  },

  card: {
    margin: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
  },
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
    gap: 4,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    marginHorizontal: 16,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  section: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },

  bottomSpacer: {
    height: 100,
  },
  purchaseBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: { paddingBottom: 28 },
      android: { paddingBottom: 16 },
      default: { paddingBottom: 16 },
    }),
  },
  purchaseBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  buyButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 100,
  },
  buyButtonDisabled: {
    backgroundColor: '#a1a1aa',
  },
  buyButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
