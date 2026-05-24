import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($companyCode: String!, $username: String!, $password: String!) {
    login(companyCode: $companyCode, username: $username, password: $password) {
      token
      user {
        _id username name email phone role avatar
        companyCode companyName
        notificationPrefs { newBooking paymentReceived batchFull cancelation lowSeats marketing }
        createdAt
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($phone: String!, $text: String!) {
    sendMessage(phone: $phone, text: $text) { status }
  }
`;

export const TOGGLE_AI = gql`
  mutation ToggleAI($phone: String!, $enabled: Boolean!) {
    toggleAI(phone: $phone, enabled: $enabled) {
      phone customerName step aiEnabled
      assignedGuideId assignedGuideName lastMessageAt
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) { _id read }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead { markAllNotificationsRead }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      _id name email phone avatar
    }
  }
`;
