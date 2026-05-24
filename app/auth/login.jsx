import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { Building2, KeyRound, LogIn, Mountain, User } from 'lucide-react-native';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import Pill from '../../src/components/ui/Pill';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { LOGIN } from '../../src/graphql/mutations';
import { colors, palette, radius, spacing, typography } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('staff'); // 'staff' | 'customer'
  const [form, setForm] = useState({ companyCode: '', username: '', password: '' });
  const [errors, setErrors] = useState({});

  const [doLogin, { loading }] = useMutation(LOGIN);

  const setField = (k) => (v) => {
    let val = v;
    if (k === 'companyCode') val = String(val).toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm({ ...form, [k]: val });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };

  const validate = () => {
    const e = {};
    if (!form.companyCode.trim()) e.companyCode = 'Company code is required';
    if (!form.username.trim()) e.username = mode === 'customer' ? 'Phone number is required' : 'Username is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }
    try {
      const { data } = await doLogin({
        variables: {
          companyCode: form.companyCode.trim(),
          username: form.username.trim(),
          password: form.password,
        },
      });
      if (!data?.login?.token) throw new Error('Invalid response from server');
      await login(data.login.token, data.login.user);
      toast.success(`Welcome back, ${data.login.user.name || data.login.user.username}!`);
      const role = data.login.user.role;
      if (role === 'customer') router.replace('/(customer)/treks');
      else router.replace('/(admin)/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgElevated }} edges={['bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <LinearGradient
            colors={[palette.primary[800], palette.primary[600]]}
            style={styles.hero}
          >
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <Mountain size={26} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={styles.brandText}>TrekOps</Text>
            </View>

            <Text style={styles.heroTitle}>Welcome back</Text>
            <Text style={styles.heroSubtitle}>
              Manage bookings, departures and customers — all in one place.
            </Text>

            <View style={styles.statsRow}>
              {[
                { v: '2,500+', l: 'Bookings' },
                { v: '₹45L+', l: 'Revenue' },
                { v: '150+', l: 'Treks' },
                { v: '4.9★', l: 'Rating' },
              ].map((s) => (
                <View key={s.l} style={styles.stat}>
                  <Text style={styles.statVal}>{s.v}</Text>
                  <Text style={styles.statLabel}>{s.l}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Form card */}
          <View style={styles.formCard}>
            <View style={{ flexDirection: 'row', gap: spacing[2], marginBottom: spacing[5] }}>
              <Pill active={mode === 'staff'} onPress={() => setMode('staff')}>
                Staff / Admin
              </Pill>
              <Pill active={mode === 'customer'} onPress={() => setMode('customer')}>
                Customer
              </Pill>
            </View>

            <Text style={styles.formTitle}>Sign in to your workspace</Text>
            <Text style={styles.formSubtitle}>
              {mode === 'staff'
                ? 'Enter your company code and staff credentials.'
                : 'Enter your company code and customer credentials.'}
            </Text>

            <View style={{ gap: spacing[4], marginTop: spacing[5] }}>
              <Input
                label="Company Code"
                placeholder="your-company-code"
                value={form.companyCode}
                onChangeText={setField('companyCode')}
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={Building2}
                error={errors.companyCode}
                hint="Platform admins: use admin"
              />
              <Input
                label={mode === 'customer' ? 'Phone number' : 'Username'}
                placeholder={mode === 'customer' ? '+91 98xxx xxxxx' : 'your username'}
                value={form.username}
                onChangeText={setField('username')}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={mode === 'customer' ? 'phone-pad' : 'default'}
                leftIcon={User}
                error={errors.username}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChangeText={setField('password')}
                secureTextEntry
                leftIcon={KeyRound}
                error={errors.password}
              />
            </View>

            <View style={{ marginTop: spacing[6] }}>
              <Button onPress={onSubmit} loading={loading} fullWidth leftIcon={LogIn} size="lg">
                Sign In
              </Button>
            </View>

            <Pressable hitSlop={10} style={{ marginTop: spacing[4], alignSelf: 'center' }}>
              <Text style={{ color: colors.primaryText, fontWeight: typography.weight.semibold, fontSize: typography.size.sm }}>
                Forgot password?
              </Text>
            </Pressable>

            <Text style={styles.footer}>
              By signing in you agree to TrekOps' Terms & Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 60,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[6] },
  logoBox: {
    width: 44, height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  brandText: { fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, color: '#FFFFFF', letterSpacing: -0.4 },
  heroTitle: { fontSize: typography.size['4xl'], fontWeight: typography.weight.bold, color: '#FFFFFF', marginTop: spacing[2] },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: typography.size.base, marginTop: spacing[2], lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[6] },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: radius.lg, padding: spacing[3] },
  statVal: { color: '#FFFFFF', fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: typography.size['2xs'], marginTop: 2 },
  formCard: {
    marginTop: -16,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
    flex: 1,
  },
  formTitle: { fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, color: colors.text },
  formSubtitle: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: spacing[1] },
  footer: { fontSize: typography.size.xs, color: colors.textSubtle, textAlign: 'center', marginTop: spacing[6], paddingHorizontal: spacing[4] },
});
