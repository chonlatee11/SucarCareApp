import { Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function IconButton({ icon, label, onPress, color }) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress} >
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLabel: {
    color: '#AD8B73',
    marginTop: 12,
  },
});