import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Bot, Check, CheckCheck, Send, Sparkles } from 'lucide-react-native';

import Screen from '../../../src/components/ui/Screen';
import PageHeader from '../../../src/components/ui/PageHeader';
import Avatar from '../../../src/components/ui/Avatar';
import { useSocket } from '../../../src/context/SocketContext';
import { useToast } from '../../../src/context/ToastContext';
import { GET_MESSAGES } from '../../../src/graphql/queries';
import { SEND_MESSAGE } from '../../../src/graphql/mutations';
import { colors, palette, radius, spacing, typography } from '../../../src/theme';
import { formatTime, maskPhone } from '../../../src/utils/format';

export default function ChatThreadScreen() {
  const { phone } = useLocalSearchParams();
  const { ref: socketRef } = useSocket();
  const toast = useToast();
  const listRef = useRef(null);
  const [text, setText] = useState('');

  const { data, loading, refetch, fetchMore } = useQuery(GET_MESSAGES, {
    variables: { phone, limit: 50 },
    fetchPolicy: 'cache-and-network',
  });

  const [sendMutation, { loading: sending }] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    const s = socketRef?.current;
    if (!s) return;
    const onNew = (msg) => {
      if (msg.phone === phone) refetch();
    };
    s.on('newMessage', onNew);
    s.on('messageStatusUpdate', onNew);
    return () => {
      s.off('newMessage', onNew);
      s.off('messageStatusUpdate', onNew);
    };
  }, [socketRef, phone, refetch]);

  const messages = data?.getMessages?.messages ?? [];
  // Reverse for inverted list (newest at bottom of UI, top of array for inverted)
  const reversed = [...messages].reverse();

  const send = async () => {
    if (!text.trim() || sending) return;
    const t = text.trim();
    setText('');
    try {
      await sendMutation({ variables: { phone, text: t } });
      refetch();
    } catch (e) {
      toast.error(e?.message || 'Could not send');
      setText(t);
    }
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader
          title={maskPhone(phone)}
          subtitle="WhatsApp conversation"
          back
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        style={{ flex: 1 }}
      >
        {loading && messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={reversed}
            keyExtractor={(m) => m._id}
            inverted
            contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[3], paddingBottom: spacing[2], gap: spacing[2] }}
            renderItem={({ item }) => <Bubble msg={item} />}
            onEndReached={() => {
              if (!data?.getMessages?.hasMore) return;
              const oldest = messages[0];
              if (!oldest) return;
              fetchMore({ variables: { phone, limit: 50, before: oldest._id } });
            }}
            onEndReachedThreshold={0.4}
          />
        )}

        <View style={styles.composer}>
          <TextInput
            placeholder="Type a message…"
            placeholderTextColor={colors.textDisabled}
            value={text}
            onChangeText={setText}
            multiline
            style={styles.input}
          />
          <Pressable
            disabled={!text.trim() || sending}
            onPress={send}
            style={[styles.sendBtn, { opacity: text.trim() && !sending ? 1 : 0.5 }]}
          >
            {sending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Send size={18} color="#FFFFFF" />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Bubble({ msg }) {
  const isOut = msg.direction === 'outbound';
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isOut ? 'flex-end' : 'flex-start',
      }}
    >
      <View
        style={[
          styles.bubble,
          isOut ? { backgroundColor: palette.primary[600], borderBottomRightRadius: 4 } : { backgroundColor: colors.bgElevated, borderColor: colors.borderMuted, borderWidth: 1, borderBottomLeftRadius: 4 },
        ]}
      >
        <Text style={{ color: isOut ? '#FFFFFF' : colors.text, fontSize: typography.size.sm, lineHeight: 20 }}>
          {msg.message}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
          <Text style={{ fontSize: typography.size['2xs'], color: isOut ? 'rgba(255,255,255,0.7)' : colors.textSubtle }}>
            {formatTime(msg.createdAt)}
          </Text>
          {isOut ? <Tick status={msg.deliveryStatus} /> : null}
        </View>
      </View>
    </View>
  );
}

function Tick({ status }) {
  const tinted = status === 'read';
  const color = tinted ? '#7DD3FC' : 'rgba(255,255,255,0.7)';
  if (status === 'delivered' || status === 'read') return <CheckCheck size={12} color={color} />;
  return <Check size={12} color={color} />;
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.xl,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: Platform.OS === 'ios' ? spacing[3] : spacing[2],
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    gap: spacing[2],
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgMuted,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.size.base,
    color: colors.text,
    maxHeight: 120,
  },
  sendBtn: {
    width: 42, height: 42,
    borderRadius: 21,
    backgroundColor: palette.primary[600],
    alignItems: 'center', justifyContent: 'center',
  },
});
