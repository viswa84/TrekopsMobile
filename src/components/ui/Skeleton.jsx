import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors, radius } from '../../theme';

export function Skeleton({ width = '100%', height = 16, style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius.sm, backgroundColor: colors.bgMuted, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ height = 120 }) {
  return (
    <View
      style={{
        backgroundColor: colors.bgElevated,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.borderMuted,
        padding: 16,
        gap: 12,
        height,
      }}
    >
      <Skeleton height={14} width="60%" />
      <Skeleton height={24} width="40%" />
      <Skeleton height={12} width="80%" />
    </View>
  );
}

export default Skeleton;
