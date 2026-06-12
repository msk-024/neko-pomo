import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/colors';
import { useTodoStore } from '@/stores/todoStore';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const [inputText, setInputText] = useState('');

  function handleSubmit() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    setInputText('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSubmit}
          placeholder="やることを追加…"
          placeholderTextColor={Colors.brownLt}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>やることを追加してね🐾</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.creamDk,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.brown,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.pink,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    lineHeight: 28,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.brownMid,
    marginTop: 24,
    fontSize: 14,
  },
});
