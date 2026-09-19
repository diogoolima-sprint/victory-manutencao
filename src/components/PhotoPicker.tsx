import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, fonts, radii } from '../theme';
import { CameraIcon, GalleryIcon } from './icons';
import { uploadPhoto } from '../services/storage';

interface PhotoPickerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  folder: string;
  max?: number;
  helperText?: string;
}

export function PhotoPicker({ photos, onChange, folder, max = 6, helperText }: PhotoPickerProps) {
  const [uploading, setUploading] = useState(false);

  async function handlePicked(result: ImagePicker.ImagePickerResult) {
    if (result.canceled || !result.assets?.length) return;
    setUploading(true);
    try {
      const url = await uploadPhoto(result.assets[0].uri, folder);
      onChange([...photos, url]);
    } catch {
      Alert.alert('Erro ao enviar foto', 'Tente novamente em instantes.');
    } finally {
      setUploading(false);
    }
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão necessária', 'Autorize o uso da câmera para fotografar o problema.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    await handlePicked(result);
  }

  async function pickFromGallery() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para anexar uma imagem.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ['images'] });
    await handlePicked(result);
  }

  function removePhoto(url: string) {
    onChange(photos.filter((p) => p !== url));
  }

  const canAddMore = photos.length < max;

  return (
    <View style={{ gap: 10 }}>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {canAddMore ? (
        <View style={styles.row}>
          <Pressable style={styles.action} onPress={takePhoto} disabled={uploading}>
            <CameraIcon />
            <Text style={styles.actionLabel}>Tirar foto</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={pickFromGallery} disabled={uploading}>
            <GalleryIcon />
            <Text style={styles.actionLabel}>Escolher da galeria</Text>
          </Pressable>
        </View>
      ) : null}
      {uploading ? <ActivityIndicator color={colors.coral} /> : null}
      {photos.length ? (
        <View style={styles.thumbRow}>
          {photos.map((url) => (
            <View key={url} style={styles.thumbWrap}>
              <Image source={{ uri: url }} style={styles.thumb} />
              <Pressable style={styles.remove} onPress={() => removePhoto(url)}>
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  helper: { fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  action: {
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    borderRadius: radii.md,
  },
  actionLabel: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.text },
  thumbRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  thumbWrap: { width: 74, height: 74, borderRadius: radii.md, overflow: 'visible' },
  thumb: { width: 74, height: 74, borderRadius: radii.md, backgroundColor: colors.bgSunken },
  remove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: colors.white, fontWeight: '700', fontSize: 13, lineHeight: 14 },
});
