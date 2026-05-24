import { Linking, StyleSheet, Text, View } from 'react-native';
import { MessageCircle, Phone } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import { useQuery } from '@apollo/client/react';
import { GET_COMPANY_PROFILE } from '../../src/graphql/queries';
import { colors, palette, spacing, typography } from '../../src/theme';

export default function CustomerChatScreen() {
  const { data } = useQuery(GET_COMPANY_PROFILE);
  const p = data?.getCompanyProfile;

  const businessPhone = p?.businessWhatsappNumber || p?.phone;

  return (
    <Screen scroll>
      <PageHeader title="Support" subtitle="We're here to help, 24/7" />

      <Card>
        <Text style={styles.title}>{p?.companyName || 'TrekOps'} Support</Text>
        <Text style={styles.subtitle}>
          Chat with us on WhatsApp for instant help with bookings, payments, or trek information.
        </Text>
        <View style={{ marginTop: spacing[4], gap: spacing[3] }}>
          <Button
            onPress={() => businessPhone && Linking.openURL(`https://wa.me/${String(businessPhone).replace(/\D/g, '')}`)}
            leftIcon={MessageCircle}
            fullWidth
            size="lg"
            disabled={!businessPhone}
          >
            Chat on WhatsApp
          </Button>
          {p?.phone ? (
            <Button
              variant="secondary"
              onPress={() => Linking.openURL(`tel:${p.phone}`)}
              leftIcon={Phone}
              fullWidth
              size="lg"
            >
              Call {p.phone}
            </Button>
          ) : null}
        </View>
      </Card>

      <Card style={{ marginTop: spacing[4] }}>
        <Text style={styles.title}>FAQs</Text>
        <View style={{ marginTop: spacing[3], gap: spacing[3] }}>
          {[
            { q: 'How do I book a trek?', a: 'Browse Explore → tap a trek → pick a departure → Book.' },
            { q: 'Can I get a refund?', a: 'Cancellations follow our refund policy. Contact support for details.' },
            { q: 'What should I carry?', a: 'Each trek page lists recommended items. Check it before departure.' },
          ].map((f) => (
            <View key={f.q}>
              <Text style={{ fontWeight: typography.weight.semibold, color: colors.text, fontSize: typography.size.sm }}>
                {f.q}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: typography.size.sm, marginTop: 2, lineHeight: 20 }}>
                {f.a}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  subtitle: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: spacing[1], lineHeight: 20 },
});
