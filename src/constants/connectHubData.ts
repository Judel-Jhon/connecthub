// ============================================================
// ConnectHub - Data Types & Mock Data
// Aligned with: Human-in-the-Loop AI-Assisted Stakeholder
//               Concern Processing Framework (HISCPF)
// ============================================================

// ── User & Role Types ──────────────────────────────────────
export type UserRole = 'stakeholder' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar: string; // initials
}

// ── Concern Types ──────────────────────────────────────────
export type ConcernStatus =
  | 'pending'
  | 'under-review'
  | 'in-progress'
  | 'resolved'
  | 'rejected';

export type ConcernPriority = 'critical' | 'high' | 'medium' | 'low';

export interface StatusUpdate {
  status: ConcernStatus;
  date: string;
  updatedBy: string;
  note?: string;
}

export interface ConcernResponse {
  id: string;
  message: string;
  from: string;
  fromRole: UserRole;
  date: string;
}

export interface Concern {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ConcernStatus;
  priority: ConcernPriority;
  submittedBy: string;
  submitterAvatar: string;
  department: string;
  dateSubmitted: string;
  lastUpdated: string;
  // AI suggestions (stored separately per thesis framework)
  aiSuggestedCategory?: string;
  aiSuggestedPriority?: ConcernPriority;
  aiGeneratedSummary?: string;
  aiConfidence?: number; // 0-100
  // Final human decision (stored separately per thesis framework)
  confirmedCategory?: string;
  confirmedPriority?: ConcernPriority;
  confirmedBy?: string;
  confirmedDate?: string;
  // Tracking
  statusHistory: StatusUpdate[];
  responses: ConcernResponse[];
}

// ── Announcement Types ─────────────────────────────────────
export type AnnouncementType = 'announcement' | 'advisory';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  department: string;
  datePublished: string;
  author: string;
  isActive: boolean;
  isPinned: boolean;
}

// ── Service Request Types ──────────────────────────────────
export interface ServiceRequest {
  id: string;
  type: string;
  description: string;
  status: ConcernStatus;
  submittedBy: string;
  dateSubmitted: string;
  assignedTo?: string;
  resolution?: string;
}

// ── Emergency Alert Types ──────────────────────────────────
export type EmergencyType = 'fire' | 'police' | 'medical' | 'accident';

export interface EmergencyAlert {
  id: string;
  type: EmergencyType;
  reportedBy: string;
  reporterAvatar: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
  dateReported: string;
  timestamp: string;
  status: 'active' | 'responding' | 'resolved';
  message?: string;
}

export const EMERGENCY_TYPE_LABELS: Record<EmergencyType, string> = {
  fire: 'Fire Emergency',
  police: 'Police Assistance',
  medical: 'Medical Emergency',
  accident: 'Accident / Injury',
};

export const EMERGENCY_TYPE_COLORS: Record<EmergencyType, string> = {
  fire: '#EF4444',
  police: '#1D4ED8',
  medical: '#10B981',
  accident: '#F97316',
};

export const EMERGENCY_TYPE_ICONS: Record<EmergencyType, string> = {
  fire: 'flame',
  police: 'shield',
  medical: 'medkit',
  accident: 'warning',
};

// Shared mock store — mutated at runtime to simulate real-time
export const MOCK_EMERGENCY_ALERTS: EmergencyAlert[] = [];

// ── Notification Types ─────────────────────────────────────
export type NotificationType =
  | 'status_update'
  | 'announcement'
  | 'response'
  | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
  relatedId?: string;
}

// ── Constants ──────────────────────────────────────────────
export const DEPARTMENTS = [
  'Academic Affairs',
  'Student Services',
  'IT Services',
  'Facilities & Maintenance',
  'Finance Office',
  'Registrar',
  'General',
];

export const CONCERN_CATEGORIES = [
  'Academic',
  'Facilities',
  'IT / Technical',
  'Administrative',
  'Safety & Security',
  'Financial',
  'Student Welfare',
  'Other',
];

export const SERVICE_TYPES = [
  'Document Request',
  'ID Replacement',
  'Equipment Reservation',
  'Room Reservation',
  'Certificate Request',
  'Clearance Processing',
  'Other',
];

export const PRIORITY_LABELS: Record<ConcernPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const STATUS_LABELS: Record<ConcernStatus, string> = {
  pending: 'Pending',
  'under-review': 'Under Review',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<ConcernStatus, string> = {
  pending: '#F59E0B',
  'under-review': '#6366F1',
  'in-progress': '#0EA5E9',
  resolved: '#10B981',
  rejected: '#EF4444',
};

export const PRIORITY_COLORS: Record<ConcernPriority, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#10B981',
};

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_CURRENT_USER: User = {
  id: 'u1',
  name: 'Judel Jhon Cubelo',
  email: 'judel.cubelo@jrmsu.edu.ph',
  role: 'stakeholder',
  department: 'College of Computing Studies',
  avatar: 'JC',
};

export const MOCK_ADMIN_USER: User = {
  id: 'a1',
  name: 'Admin ConnectHub',
  email: 'admin@jrmsu.edu.ph',
  role: 'admin',
  department: 'Office of the President',
  avatar: 'AD',
};

// ── Mock Accounts (email → { password, user }) ────────────────
// In production replace with a real auth API call.
export const MOCK_USER_ACCOUNTS: Record<
  string,
  { password: string; user: User }
> = {
  'judel.cubelo@jrmsu.edu.ph': {
    password: 'stakeholder123',
    user: MOCK_CURRENT_USER,
  },
  'admin@jrmsu.edu.ph': {
    password: 'admin123',
    user: MOCK_ADMIN_USER,
  },
};

export const MOCK_CONCERNS: Concern[] = [
  {
    id: 'c1',
    title: 'Broken Air Conditioning in CCS Room 201',
    description:
      'The air conditioning unit in CCS Room 201 has not been functioning for the past week. Classes are becoming uncomfortable, especially during afternoon sessions. Multiple students have complained about the heat affecting concentration.',
    category: 'Facilities',
    status: 'in-progress',
    priority: 'high',
    submittedBy: 'Judel Jhon Cubelo',
    submitterAvatar: 'JC',
    department: 'Facilities & Maintenance',
    dateSubmitted: 'Sep 28, 2026',
    lastUpdated: 'Sep 30, 2026',
    aiSuggestedCategory: 'Facilities',
    aiSuggestedPriority: 'high',
    aiGeneratedSummary:
      'Non-functional AC unit in CCS Room 201 affecting afternoon classes. Multiple student complaints regarding heat and reduced concentration.',
    aiConfidence: 92,
    confirmedCategory: 'Facilities',
    confirmedPriority: 'high',
    confirmedBy: 'Admin Staff',
    confirmedDate: 'Sep 29, 2026',
    statusHistory: [
      { status: 'pending', date: 'Sep 28, 2026', updatedBy: 'System' },
      {
        status: 'under-review',
        date: 'Sep 29, 2026',
        updatedBy: 'Admin Staff',
        note: 'AI suggestion accepted. Forwarding to maintenance.',
      },
      {
        status: 'in-progress',
        date: 'Sep 30, 2026',
        updatedBy: 'Maintenance Team',
        note: 'Technician assigned. Scheduled for inspection.',
      },
    ],
    responses: [
      {
        id: 'r1',
        message:
          'Thank you for reporting this. We have forwarded your concern to the Facilities & Maintenance department.',
        from: 'Admin Staff',
        fromRole: 'admin',
        date: 'Sep 29, 2026',
      },
      {
        id: 'r2',
        message:
          'A maintenance technician has been assigned. Expected resolution within 2-3 business days.',
        from: 'Maintenance Team',
        fromRole: 'staff',
        date: 'Sep 30, 2026',
      },
    ],
  },
  {
    id: 'c2',
    title: 'Wi-Fi Connectivity Issues in Library',
    description:
      'The Wi-Fi connection in the university library drops frequently, especially during peak hours (10 AM - 2 PM). Students are unable to access online research materials and cloud-based applications reliably.',
    category: 'IT / Technical',
    status: 'under-review',
    priority: 'medium',
    submittedBy: 'Judel Jhon Cubelo',
    submitterAvatar: 'JC',
    department: 'IT Services',
    dateSubmitted: 'Sep 30, 2026',
    lastUpdated: 'Oct 1, 2026',
    aiSuggestedCategory: 'IT / Technical',
    aiSuggestedPriority: 'high',
    aiGeneratedSummary:
      'Frequent Wi-Fi dropouts in library during 10AM-2PM peak hours. Impacting student access to online research and cloud tools.',
    aiConfidence: 88,
    statusHistory: [
      { status: 'pending', date: 'Sep 30, 2026', updatedBy: 'System' },
      {
        status: 'under-review',
        date: 'Oct 1, 2026',
        updatedBy: 'IT Admin',
        note: 'AI categorized correctly. Adjusting priority from High to Medium.',
      },
    ],
    responses: [
      {
        id: 'r3',
        message:
          'We are reviewing your concern. Our IT team will investigate the network infrastructure in the library area.',
        from: 'IT Admin',
        fromRole: 'admin',
        date: 'Oct 1, 2026',
      },
    ],
  },
  {
    id: 'c3',
    title: 'Request for Extended Library Hours During Finals',
    description:
      'As finals week approaches, many students need additional study time. We are requesting that the library extend its operating hours from 6 PM to 9 PM during the finals period (Oct 14-25).',
    category: 'Academic',
    status: 'pending',
    priority: 'medium',
    submittedBy: 'Judel Jhon Cubelo',
    submitterAvatar: 'JC',
    department: 'Academic Affairs',
    dateSubmitted: 'Oct 1, 2026',
    lastUpdated: 'Oct 1, 2026',
    aiSuggestedCategory: 'Academic',
    aiSuggestedPriority: 'medium',
    aiGeneratedSummary:
      'Request to extend library hours (6PM-9PM) during finals week Oct 14-25 for additional student study time.',
    aiConfidence: 95,
    statusHistory: [
      { status: 'pending', date: 'Oct 1, 2026', updatedBy: 'System' },
    ],
    responses: [],
  },
  {
    id: 'c4',
    title: 'Insufficient Parking Space for Faculty',
    description:
      'Faculty members are consistently unable to find parking during morning hours. The designated faculty parking area is often occupied by non-authorized vehicles.',
    category: 'Facilities',
    status: 'resolved',
    priority: 'low',
    submittedBy: 'Leo Alfier Antipuesto',
    submitterAvatar: 'LA',
    department: 'Facilities & Maintenance',
    dateSubmitted: 'Sep 20, 2026',
    lastUpdated: 'Sep 27, 2026',
    confirmedCategory: 'Facilities',
    confirmedPriority: 'low',
    confirmedBy: 'Admin Staff',
    confirmedDate: 'Sep 21, 2026',
    statusHistory: [
      { status: 'pending', date: 'Sep 20, 2026', updatedBy: 'System' },
      {
        status: 'under-review',
        date: 'Sep 21, 2026',
        updatedBy: 'Admin Staff',
      },
      {
        status: 'in-progress',
        date: 'Sep 23, 2026',
        updatedBy: 'Security Office',
        note: 'Security personnel assigned to enforce parking rules.',
      },
      {
        status: 'resolved',
        date: 'Sep 27, 2026',
        updatedBy: 'Admin Staff',
        note: 'Additional signage installed. Security now monitors parking area.',
      },
    ],
    responses: [
      {
        id: 'r4',
        message:
          'Issue has been resolved with additional parking signage and security monitoring.',
        from: 'Admin Staff',
        fromRole: 'admin',
        date: 'Sep 27, 2026',
      },
    ],
  },
  {
    id: 'c5',
    title: 'Safety Concern: Loose Floor Tiles Near Canteen',
    description:
      'Several floor tiles near the main canteen entrance are loose and pose a tripping hazard. A student nearly fell yesterday. Immediate attention is needed.',
    category: 'Safety & Security',
    status: 'in-progress',
    priority: 'critical',
    submittedBy: 'Jashtenne Jardin',
    submitterAvatar: 'JJ',
    department: 'Facilities & Maintenance',
    dateSubmitted: 'Oct 1, 2026',
    lastUpdated: 'Oct 2, 2026',
    aiSuggestedCategory: 'Safety & Security',
    aiSuggestedPriority: 'critical',
    aiGeneratedSummary:
      'Loose floor tiles near canteen entrance creating tripping hazard. Near-incident reported. Requires immediate maintenance.',
    aiConfidence: 97,
    confirmedCategory: 'Safety & Security',
    confirmedPriority: 'critical',
    confirmedBy: 'Admin Staff',
    confirmedDate: 'Oct 1, 2026',
    statusHistory: [
      { status: 'pending', date: 'Oct 1, 2026', updatedBy: 'System' },
      {
        status: 'under-review',
        date: 'Oct 1, 2026',
        updatedBy: 'Admin Staff',
        note: 'Critical priority confirmed. Escalated immediately.',
      },
      {
        status: 'in-progress',
        date: 'Oct 2, 2026',
        updatedBy: 'Maintenance Team',
        note: 'Area cordoned off. Repair scheduled for today.',
      },
    ],
    responses: [],
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Midterm Examination Schedule - 1st Semester AY 2026-2027',
    content:
      'The midterm examination for the 1st Semester of Academic Year 2026-2027 will be held from October 7-11, 2026. Students are advised to coordinate with their respective instructors for the specific schedule. Please review the attached examination guidelines.',
    type: 'announcement',
    department: 'Academic Affairs',
    datePublished: 'Sep 30, 2026',
    author: 'Office of the Registrar',
    isActive: true,
    isPinned: true,
  },
  {
    id: 'a2',
    title: 'System Maintenance Notice - Student Portal',
    content:
      'The Student Portal will undergo scheduled maintenance on October 5, 2026 from 10 PM to 6 AM (Oct 6). During this period, the portal will be temporarily unavailable. We apologize for any inconvenience.',
    type: 'advisory',
    department: 'IT Services',
    datePublished: 'Oct 1, 2026',
    author: 'IT Services Department',
    isActive: true,
    isPinned: false,
  },
  {
    id: 'a3',
    title: 'Campus Clean-Up Drive - Volunteers Needed',
    content:
      'Join our campus-wide clean-up drive on October 12, 2026 (Saturday) from 7 AM to 12 PM. All students, faculty, and staff are encouraged to participate. Cleaning materials will be provided. Assembly point: University Gymnasium.',
    type: 'announcement',
    department: 'Student Services',
    datePublished: 'Oct 1, 2026',
    author: 'Office of Student Affairs',
    isActive: true,
    isPinned: false,
  },
  {
    id: 'a4',
    title: 'Weather Advisory: Tropical Depression Warning',
    content:
      'PAGASA has issued a weather advisory for our region. Classes may be suspended depending on signal levels. Please monitor official announcements through ConnectHub and the university social media pages.',
    type: 'advisory',
    department: 'General',
    datePublished: 'Oct 2, 2026',
    author: 'University Administration',
    isActive: true,
    isPinned: true,
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Concern Status Updated',
    message:
      'Your concern "Broken Air Conditioning in CCS Room 201" status changed to In Progress.',
    type: 'status_update',
    date: '2 hours ago',
    isRead: false,
    relatedId: 'c1',
  },
  {
    id: 'n2',
    title: 'New Response',
    message:
      'Maintenance Team responded to your concern about Wi-Fi connectivity.',
    type: 'response',
    date: '5 hours ago',
    isRead: false,
    relatedId: 'c2',
  },
  {
    id: 'n3',
    title: 'New Advisory Posted',
    message: 'Weather Advisory: Tropical Depression Warning — check details.',
    type: 'announcement',
    date: 'Today',
    isRead: true,
    relatedId: 'a4',
  },
  {
    id: 'n4',
    title: 'Concern Submitted',
    message:
      'Your concern "Request for Extended Library Hours" has been submitted successfully.',
    type: 'system',
    date: 'Yesterday',
    isRead: true,
    relatedId: 'c3',
  },
  {
    id: 'n5',
    title: 'Concern Resolved',
    message:
      'Concern "Insufficient Parking Space for Faculty" has been resolved.',
    type: 'status_update',
    date: '3 days ago',
    isRead: true,
    relatedId: 'c4',
  },
];
