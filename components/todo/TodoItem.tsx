import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import type { Todo } from '@/stores/todoStore';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => onToggle(todo.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.check, todo.done && styles.checkDone]}>
          {todo.done ? '✅' : '⬜'}
        </Text>
        <Text style={[styles.text, todo.done && styles.textDone]}>
          {todo.text}
        </Text>
      </TouchableOpacity>

      {todo.done && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(todo.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creamDk,
    borderRadius: 12,
    marginBottom: 8,
    paddingRight: 4,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  check: { fontSize: 18 },
  checkDone: { opacity: 0.6 },
  text: {
    flex: 1,
    fontSize: 15,
    color: Colors.brown,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: Colors.brownMid,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteText: {
    fontSize: 12,
    color: Colors.brownMid,
    fontWeight: '700',
  },
});
