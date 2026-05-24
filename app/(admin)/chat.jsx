import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bot, MessageSquare, Sparkles } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import SearchBar from '../../src/components/ui/SearchBar';
import Avatar from '../../src/components/ui/Avatar';
import Badge from '../../src/components/ui/Badge';
import EmptyState from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { useSocket } from '../../src/context/SocketContext';
import { GET_CHATS } from '../../src/graphql/queries';
import { colors, palette, radius, shadow, spacing, typography } from '../../src/theme';
import { relativeTime, maskPhone } from '../../src/utils/format';

export default function ChatListScreen() {
  const router = useRouter();
  const { ref: socketRef } = useSocket();
  const [search, setSearch] = useState('');
  const { data, loading, refetch } = useQuery(GET_CHATS, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    const s = socketRef?.current;
    if (!s) return;
    const onNewMessage = () => refetch();
    s.on('newMessage', onNewMessage);
    s.on('messageStatusUpdate', onNewMessage);
    return () => {
      s.off('newMessage', onNewMessage);
      s.off('messageStatusUpdate', onNewMessage);
    };
  }, [socketRef, refetch]);

  const chats = (data?.getChats ?? []).filter((c) => {
    const q = search.toLowerCase();
    return !q || (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
  });

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader title="Support Chat" subtitle="WhatsApp conversations" />
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search conversations…" />
      </View>

      {loading && !data ? (
        <View style={{ padding: spacing[4], gap: spacing[3] }}>
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} height={80} />)}
        </View>
      ) : chats.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations" message="Once a customer messages you, you'll see them here." />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(c) => c.phone}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[20], gap: spacing[2] }}
          onRefresh={() => refetch()}
          refreshing={loading}
          renderItem={({ item }) => (
            <ChatRow chat={item} onPress={() => router.push(`/(admin)/chat/${item.phone}`)} />
          )}
        />
      )}
    </Screen>
  );
}

function ChatRow({ chat, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.95 }]}>
      <Avatar name={chat.name || chat.phone} size={48} />
      <View style={{ flex: 1, marginLeft: spacing[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <Text style={styles.name} numberOfLines={1}>{chat.name || maskPhone(chat.phone)}</Text>
          {chat.aiEnabled ? (
            <View style={styles.aiBadge}>
              <Sparkles size={10} color={palette.purple[700]} />
              <Text style={{ fontSize: 9, fontWeight: typography.weight.bold, color: palette.purple[700] }}>AI</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.message} numberOfLines={1}>{chat.lastMessage || 'No messages yet'}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={styles.time}>{relativeTime(chat.lastMessageTime)}</Text>
        {chat.messageCount ? (
          <View style={styles.count}>
            <Text style={{ fontSize: typography.size['2xs'], color: '#FFFFFF', fontWeight: typography.weight.bold }}>
              {chat.messageCount > 99 ? '99+' : chat.messageCount}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.borderMuted,
    padding: spacing[3],
    ...shadow.xs,
  },
  name: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text },
  message: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: typography.size['2xs'], color: colors.textSubtle },
  count: {
    minWidth: 18, paddingHorizontal: 6, height: 18,
    borderRadius: 9, backgroundColor: palette.primary[600],
    alignItems: 'center', justifyContent: 'center',
  },
  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: palette.purple[50],
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4,
  },
});
