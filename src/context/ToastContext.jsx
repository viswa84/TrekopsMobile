import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '../theme';

const ToastContext = createContext(null);

const palette = {
  success: { bg: '#ECFDF5', text: '#065F46', icon: CheckCircle2, color: '#059669' },
  error:   { bg: '#FEF2F2', text: '#991B1B', icon: XCircle, color: '#DC2626' },
  warning: { bg: '#FFFBEB', text: '#92400E', icon: AlertCircle, color: '#D97706' },
  info:    { bg: '#EFF6FF', text: '#1E40AF', icon: Info, color: '#2563EB' },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const hideTimer = useRef(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToast(null));
  }, [opacity]);

  const show = useCallback(
    (message, type = 'info') => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setToast({ message, type });
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(hide, 3200);
    },
    [opacity, hide],
  );

  const api = {
    show,
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info: (msg) => show(msg, 'info'),
  };

  const cfg = toast ? palette[toast.type] : null;
  const Icon = cfg?.icon;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast && cfg && (
        <Animated.View
          pointerEvents="none"
          style={[styles.container, { top: insets.top + 8, opacity, backgroundColor: cfg.bg }]}
        >
          {Icon && <Icon size={18} color={cfg.color} />}
          <Text style={[styles.text, { color: cfg.text }]} numberOfLines={2}>
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    gap: spacing[2],
    ...shadow.md,
    zIndex: 9999,
  },
  text: {
    flex: 1,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return { show: () => {}, success: () => {}, error: () => {}, warning: () => {}, info: () => {} };
  return ctx;
};
