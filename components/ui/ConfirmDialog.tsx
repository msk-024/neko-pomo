import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface Props {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Webでも動く確認ダイアログ（Alert.alertはWeb非対応のため自前実装） */
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 340,
    backgroundColor: Colors.cream,
    borderRadius: 24,
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.brown,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: Colors.brownMid,
    textAlign: "center",
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.creamDk,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.brownMid,
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
