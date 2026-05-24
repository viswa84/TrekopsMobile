import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Mountain } from 'lucide-react-native';
import { useAuth } from '../src/context/AuthContext';
import { palette, typography } from '../src/theme';

export default function SplashGate() {
  const router = useRouter();
  const { bootstrapping, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (bootstrapping) return;
    const t = setTimeout(() => {
      if (!isAuthenticated) router.replace('/auth/login');
      else if (isAdmin) router.replace('/(admin)/dashboard');
      else router.replace('/(customer)/treks');
    }, 600);
    return () => clearTimeout(t);
  }, [bootstrapping, isAuthenticated, isAdmin, router]);

  return (
    <LinearGradient
      colors={[palette.primary[800], palette.primary[600], palette.primary[500]]}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          width: 96, height: 96,
          borderRadius: 24,
          backgroundColor: 'rgba(255,255,255,0.18)',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <Mountain size={48} color="#FFFFFF" strokeWidth={2.2} />
      </View>
      <Text style={{ fontSize: typography.size['4xl'], fontWeight: typography.weight.bold, color: '#FFFFFF', letterSpacing: -0.5 }}>
        TrekOps
      </Text>
      <Text style={{ fontSize: typography.size.sm, color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>
        Manage your treks. Effortlessly.
      </Text>
    </LinearGradient>
  );
}
