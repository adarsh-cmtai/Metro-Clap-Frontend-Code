export interface User {
  _id: string;
  name: string;
  mobileNumber: string;
  role: 'customer' | 'partner' | 'admin';
  email?: string;
  avatarUrl?: string;
  rating?: number;
  partnerProfile?: PartnerProfile;
  status?: 'Pending' | 'Approved' | 'Suspended';
  createdAt: string; 
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
}

interface Contact { name: string; mobile: string; email: string; }
interface AddressInfo { pin: string; street: string; house: string; apartment: string; landmark: string; district: string; state: string; }

export interface PartnerProfile {
  bio?: string;
  skills?: string[];
  serviceablePincodes?: string[];
  companyName?: string;
  aadhaarNo?: string;
  gstNo?: string;
  contacts?: Contact[];
  addresses?: AddressInfo[];
  documents?: {
    photoUrl?: string;
    aadhaarFrontUrl?: string;
    aadhaarBackUrl?: string;
    gstCertificateUrl?: string;
    aadhaar?: { status: string };
    bankAccount?: { status: string };
    skillCertificate?: { status: string };
  };
}


export interface LocationSuggestion {
  _id: string;
  name: string;
  slug: string;
  coordinates: [number, number];
}

export type PartnerStatus = "Pending" | "Approved" | "Suspended";

export interface Partner extends User {
  city?: string;
  rating: number;
  status: PartnerStatus;
}

export interface Customer extends User {
  city?: string;
  totalBookings: number;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Location {
    _id: string;
    name: string;
    city: string;
    state: string;
    pincode: string;
    isActive: boolean;
}


export interface SubService {
    _id: string;
    name: string;
    serviceId: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
}

export interface DashboardData {
  totalEarningsMonth: number;
  totalBookingsMonth: number;
  newCustomersMonth: number;
  newPartnersMonth: number;
  pendingPartnerApprovals: number;
  bookingsByStatus: { name: string; value: number }[];
  topServices: { name: string; bookings: number }[];
}

export type BookingStatus = "Pending" | "Searching" | "Confirmed" | "Completed" | "Cancelled" | "Partially Assigned";
export type ItemStatus = 'Pending Assignment' | 'PendingPartnerConfirmation' | 'Assigned' | 'InProgress' | 'CompletedByPartner' | 'Completed' | 'Cancelled';

interface PartnerInfo {
    _id: string;
    name: string;
    rating: number;
    avatarUrl?: string;
    mobileNumber?: string;
}

export interface BookingItem {
  _id: string;
  serviceId: { _id: string; name: string; };
  serviceName: string;
  quantity: number;
  totalPrice: number;
  partnerId?: PartnerInfo | null;
  status: ItemStatus;
  payoutStatus: 'Pending' | 'Paid' | 'Failed';
}

export interface Booking {
  _id: string;
  bookingId: string;
  customerId: { _id: string; name: string; mobileNumber?: string };
  items: BookingItem[];
  bookingDate: string;
  status: BookingStatus;
  totalPrice: number;
  address: string;
  paymentStatus: string;
  broadcastedTo?: string[];
  assignmentDeadline?: string;
}

export interface Review {
  _id: string;
  customerId: { _id: string; name: string; avatarUrl?: string };
  partnerId: { _id: string; name: string };
  serviceId: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface ReportData {
  revenueByCity: { name: string; revenue: number }[];
  bookingsByDay: { day: string; bookings: number }[];
  customerRepeatData: { name: string; value: number }[];
  topPartners: { name: string; rating: number; completed: number }[];
}

export interface UpcomingBooking {
    _id: string;
    items: BookingItem[];
    bookingDate: string;
}

export interface CustomerDashboardData {
    upcomingBooking: UpcomingBooking | null;
}

export interface CustomerBooking {
  _id: string;
  items: BookingItem[];
  bookingDate: string;
  status: BookingStatus;
  address: string;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Failed';
  paymentMethod: 'Online' | 'COD';
  amountPaid: number;
  amountDue: number;
  isRated: boolean;
  bookingOTP?: string;
}

export interface ProAssignedJob {
    bookingId: string;
    itemId: string;
    serviceName: string;
    date: string;
    time: string;
    status: ItemStatus;
    bookingStatus: BookingStatus;
    customer: {
        name: string;
        avatarUrl?: string;
    };
    address: string;
    totalAmount: number;
    earnings: number;
    isRejectedByMe?: boolean;
    rejectionReason?: string;
}

export interface ProUpcomingJob {
    timeSlot: string;
    serviceName: string;
    customerName: string;
    address: string;
}

export interface ProNewRequest {
    bookingId: string;
    itemId: string;
    serviceName: string;
    location: string;
    earnings: number;
}

export interface ProDashboardData {
    todaysEarnings: number;
    weeksEarnings: number;
    rating: number;
    todayJobs: ProUpcomingJob[];
    newJobRequests: ProNewRequest[];
    performance: {
        acceptanceRate: number;
        completionRate: number;
        fiveStarRatings: number;
    }
}

export interface ProReview {
    _id: string;
    customerId: {
        name: string;
        avatarUrl?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ProRatingSummary {
    totalReviews: number;
    avgRating: number;
    ratingDistribution: {
        stars: number;
        count: number;
    }[];
}

export interface ProReviewsData {
    reviews: ProReview[];
    summary: ProRatingSummary;
}

export interface PartnerApplication {
    _id: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    services: string[];
    city: string;
    companyName: string;
    aadhaarNo: string;
    gstNo?: string;
    contacts: { name: string; mobile: string; email: string; }[];
    addresses: { pin: string; street: string; house: string; apartment: string; landmark: string; district: string; state: string; }[];
    servicePincodes: string[];
    documents: {
        photoUrl?: string;
        aadhaarFrontUrl?: string;
        aadhaarBackUrl?: string;
        gstCertificateUrl?: string;
    };
    createdAt: string;
}

interface ServiceOption {
    _id: string;
    name: string;
    price: number;
}

interface ServiceOptionGroup {
    _id: string;
    name: string;
    selectionType: 'single' | 'multiple';
    options: ServiceOption[];
}

interface ServiceOption {
    _id: string;
    name: string;
    price: number;
    description?: string;
}

interface ServiceOptionGroup {
    _id: string;
    name: string;
    description?: string;
    options: ServiceOption[];
}

interface FAQ {
    _id?: string;
    question: string;
    answer: string;
}

interface HowItWorksStep {
    _id?: string;
    title: string;
    description: string;
}

export interface Service {
  _id: string;
  basePrice:number;
  name: string;
  slug: string;
  category: Category;
  description: string;
  price: number;
  tagline?: string;
  duration?: string;
  isActive: boolean;
  imageUrl?: string;
  inclusions: string[];
  exclusions: string[];
  optionGroups: ServiceOptionGroup[];
  faqs: FAQ[];
  howItWorks: HowItWorksStep[];
  subServices?: SubService[];
  features?: string[];
}

export interface CategoryWithServices extends Category {
    services: Service[];
}

export interface Address {
  _id: string;
  userId: string;
  type: 'Home' | 'Office' | 'Other';
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}

export interface SupportTicket {
  _id: string;
  userId: string;
  topic: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
  replies: {
    _id: string;
    sender: 'admin' | 'customer';
    message: string;
    createdAt: string;
  }[];
}

export interface CustomerDetails {
  user: Customer;
  bookings: Booking[];
  addresses: Address[];
  supportTickets: SupportTicket[];
}

export interface AdminPartnerDetails {
  user: Partner;
  bookings: {
    _id: string;
    itemId: string;
    bookingId: string;
    serviceName: string;
    date: string;
    customerName: string;
    status: ItemStatus;
    earning: number;
  }[];
  earnings: {
    pendingPayout: number;
    totalPaid: number;
    transactions: {
      bookingId: string;
      date: string;
      amount: number;
      status: string;
    }[];
  };
  reviews: {
    list: Review[];
    summary: {
      totalReviews: number;
      avgRating: number;
    };
  };
}