import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { COMPLETION_MESSAGES, type CompletedKind } from "@/constants/messages";
import { CatDisplay } from "@/components/cat/CatDisplay";

interface Props {
  catName: string;
  /** どちらのタイマーが完了したか（休憩系は break/longBreak とも 'rest' 扱い） */
  completedKind: CompletedKind;
  onNext: () => void;
}

export function CompletionOverlay({ catName, completedKind, onNext }: Props) {
  const messages = COMPLETION_MESSAGES[completedKind];
  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <CatDisplay state="happy" />
          <Text style={styles.title}>{messages.title}</Text>
          <Text style={styles.sub}>{messages.sub(catName)}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{messages.buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(74,44,26,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.cream,
    borderRadius: 28,
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.brown,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: Colors.brownMid,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    width: "100%",
    height: 52,
    backgroundColor: Colors.green,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
