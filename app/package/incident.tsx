import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraViewComponent } from '@/components/camera-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { reportIncident } from '@/services/package.service';
import { useRoute } from '@/store/route-context';

const INCIDENT_TYPES = [
  { key: 'absent' as const,  label: 'Absent',  icon: 'person-remove-outline' }, 
  { key: 'damaged' as const, label: 'Damaged', icon: 'cube-outline' },
  { key: 'refused' as const, label: 'Refused', icon: 'close-circle-outline' },  
  { key: 'other' as const,   label: 'Other',   icon: 'ellipsis-horizontal-circle-outline' },                                                                    
];
type IncidentKey = 'absent' | 'damaged' | 'refused' | 'other';

export default function IncidentScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isDark = scheme === 'dark';
  const { addIncident, updatePackageStatus } = useRoute();

  const [incidentType, setIncidentType] = useState<IncidentKey>('absent');      
  const [comment, setComment] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);      
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Camera mode ───────────────────────────────────────────────────────────────
  if (showCamera) {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
         <CameraViewComponent
          onPhotoTaken={(uri: string) => { setCapturedPhoto(uri); setShowCamera(false); }}                                                                                
          onClose={() => setShowCamera(false)}
        />
      </View>
    );
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Required', 'Please describe what happened.');
      return;
    }
    if (!packageId) {
      Alert.alert('Error', 'No package selected.');
      return;
    }
    
    try {
      setSubmitting(true);
      const incident = await reportIncident({
        packageId: packageId,
        type: incidentType,
        comment: comment.trim(),
        photoUri: capturedPhoto ?? undefined,
        timestamp: new Date().toISOString(),
      });
      addIncident(incident);
      updatePackageStatus(packageId, 'failed');       
      Alert.alert('Reported', 'Incident has been recorded and package marked as failed.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (_e) {
      Alert.alert('Error', 'Could not submit incident. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[s.root, { backgroundColor: c.background }]} edges={['top']}>                                                                                
      {/* Top bar */}
      <View style={[s.topBar, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>      
          <Ionicons name="arrow-back" size={22} color={c.text} />
        </TouchableOpacity>
        <Text style={[s.topBarTitle, { color: c.text }]}>Report Incident</Text> 
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={s.root}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">                                                                         
          {/* Package badge */}
          <View style={[s.idBadge, { backgroundColor: c.danger + '20' }]}>        
            <Ionicons name="warning-outline" size={15} color={c.danger} />        
            <Text style={[s.idBadgeText, { color: c.danger }]}>Package ID: {packageId}</Text>                                                                                    
          </View>

          {/* Incident type */}
          <Text style={[s.sectionLabel, { color: c.text }]}>Incident Type</Text>  
          <View style={s.typeGrid}>
            {INCIDENT_TYPES.map((t) => {
              const active = incidentType === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    s.typePill,
                    { backgroundColor: active ? c.tint : (isDark ? '#1E293B' : '#F1F5F9') },                                                                                        
                    { borderColor: active ? c.tint : c.border },
                  ]}
                  onPress={() => setIncidentType(t.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={t.icon as any} size={20} color={active ? '#fff' : c.icon} />                                                                                    
                  <Text style={[s.typePillText, { color: active ? '#fff' : c.text }]}>{t.label}</Text>                                                                          
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Photo */}
          <Text style={[s.sectionLabel, { color: c.text }]}>Photo Evidence</Text> 
          {capturedPhoto ? (
            <View style={s.photoWrap}>
              <Image source={{ uri: capturedPhoto }} style={s.photo} resizeMode="cover" />                                                                                    
              <TouchableOpacity
                style={[s.retakeBtn, { borderColor: c.border }]}
                onPress={() => setShowCamera(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-reverse-outline" size={16} color={c.tint} />                                                                                             
                <Text style={[s.retakeBtnText, { color: c.tint }]}>Retake Photo</Text>                                                                                        
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                s.cameraPlaceholder,
                { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: c.border },                                                                                   
              ]}
              onPress={() => setShowCamera(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={36} color={c.icon} />
              <Text style={[s.cameraPlaceholderText, { color: c.icon }]}>Tap to take a photo (optional)</Text>                                                              
            </TouchableOpacity>
          )}

          {/* Description */}
          <Text style={[s.sectionLabel, { color: c.text }]}>
            {'Description '}
            <Text style={{ color: c.danger }}>{'*'}</Text>
          </Text>
          <TextInput
            style={[
              s.textArea,
              { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: c.border, color: c.text },                                                                    
            ]}
            placeholder="Describe what happened..."
            placeholderTextColor={c.icon}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, { backgroundColor: c.danger, marginVertical: 24, opacity: submitting ? 0.7 : 1 }]}                                                                             
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={s.submitBtnInner}>
                <Ionicons name="send-outline" size={18} color="#fff" />
                <Text style={s.submitBtnText}>Submit Report</Text>
              </View>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const iosShadow = Platform.OS === 'ios'
  ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 }                                                          
  : {};
const androidShadow = Platform.OS === 'android' ? { elevation: 2 } : {};        

const s = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },                                                                             
  topBarTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20, gap: 8 },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  idBadgeText: { fontSize: 13, fontWeight: '700' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 8,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    ...iosShadow,
    ...androidShadow,
  },
  typePillText: { fontSize: 13, fontWeight: '600' },
  photoWrap: { gap: 10 },
  photo: { width: '100%', height: 200, borderRadius: 14, backgroundColor: '#ddd' },                                                                               
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  retakeBtnText: { fontSize: 14, fontWeight: '600' },
  cameraPlaceholder: {
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraPlaceholderText: { fontSize: 14, fontWeight: '500' },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  submitBtn: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...iosShadow,
    ...androidShadow,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
