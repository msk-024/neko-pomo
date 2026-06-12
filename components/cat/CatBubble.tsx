import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface Props {
  message: string;
}

export function CatBubble({ message }: Props) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: Colors.cream,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    color: Colors.brown,
  },
});
