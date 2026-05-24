import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      _id username name email phone role avatar companyCode companyName
      notificationPrefs { newBooking paymentReceived batchFull cancelation lowSeats marketing }
      createdAt
    }
  }
`;

export const GET_DASHBOARD = gql`
  query GetDashboard {
    getDashboard {
      kpis {
        totalBookings revenue activeTreks totalChats
        bookingsChange revenueChange treksChange
        conversionRate conversionChange
      }
      revenueByMonth { month revenue }
      bookingsByRegion { name value color }
      recentActivity { id type message time status }
      alerts { id type title message priority }
    }
  }
`;

export const GET_BOOKINGS = gql`
  query GetBookings($status: String) {
    getBookings(status: $status) {
      _id txnid trek trekName departureId cityName
      name email phone peopleCount
      amount paidAmount pendingAmount status
      paymentType paymentLink balanceReminderSentAt balanceTxnid
      packageBreakdown { packageName pricePerPerson count subtotal }
      createdAt
    }
  }
`;

export const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    getBooking(id: $id) {
      _id txnid trek trekName departureId cityName
      name email phone peopleCount
      amount paidAmount pendingAmount status
      paymentType paymentLink balanceReminderSentAt balanceTxnid
      packageBreakdown { packageName pricePerPerson count subtotal }
      createdAt
    }
  }
`;

export const GET_TREKS = gql`
  query GetTreks($isActive: Boolean) {
    getTreks(isActive: $isActive) {
      _id name shortName description difficulty duration price startFrom
      image images location altitude bestSeason isActive
      seatsTotal seatsAvailable departureCount totalDepartureSeats
      createdAt
    }
  }
`;

export const GET_DEPARTURES = gql`
  query GetDepartures($trekId: ID, $cityId: ID, $status: String) {
    getDepartures(trekId: $trekId, cityId: $cityId, status: $status) {
      _id uniqueId trekId trekName cityName
      startDate endDate duration nights days
      price capacity booked status
      imageUrl meetingPoint transport
      guideId guideName
      packages { name price inclusions }
      acceptPartialPayment partialPaymentAmount
      createdAt
    }
  }
`;

export const GET_DEPARTURE = gql`
  query GetDeparture($id: ID!) {
    getDeparture(id: $id) {
      _id uniqueId trekId trekName cityName
      startDate endDate duration price capacity booked
      itinerary thingsToCarry contact meetingPoint transport
      imageUrl brochureUrl whatsappGroupInviteLink whatsappGroupName
      guideId guideName status
      packages { name price inclusions }
      acceptPartialPayment partialPaymentAmount
    }
  }
`;

export const GET_PARTICIPANTS_BY_DEPARTURE = gql`
  query GetParticipantsByDeparture($departureId: ID!) {
    getParticipantsByDeparture(departureId: $departureId) {
      bookingId txnid phone peopleCount
      amount paidAmount pendingAmount refundDue status createdAt
      participants {
        _id name phone boardingPointId boardingPointName
        bloodGroup weight createdAt
      }
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers($search: String) {
    getCustomers(search: $search) {
      _id name email phone city
      totalTreks ltv tags joinDate createdAt
    }
  }
`;

export const GET_CHATS = gql`
  query GetChats {
    getChats {
      phone name lastMessage lastMessageTime messageCount
      source step aiEnabled assignedGuideId assignedGuideName
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($phone: String!, $limit: Int, $before: String) {
    getMessages(phone: $phone, limit: $limit, before: $before) {
      messages {
        _id phone direction message raw waMessageId
        deliveryStatus deliveryFailureReason createdAt updatedAt
      }
      hasMore
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications { _id title message type read createdAt }
  }
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount { getUnreadNotificationCount }
`;

export const GET_COMPANY_PROFILE = gql`
  query GetCompanyProfile {
    getCompanyProfile {
      _id companyName tagline logoUrl
      email phone businessWhatsappNumber website
      addressLine1 city state country pincode
      primaryColor secondaryColor
    }
  }
`;
