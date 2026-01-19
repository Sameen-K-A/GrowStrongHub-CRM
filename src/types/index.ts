// Lead Status
export type LeadStatus = 'cold' | 'warm' | 'hot' | 'closed';

// Lead Source
export type LeadSource =
  | 'Instagram'
  | 'Facebook'
  | 'Friends'
  | 'Direct'
  | 'Park'
  | 'Beach'
  | 'Mall'
  | 'Referral';

// Interaction Type
export type InteractionType =
  | 'first_contact'
  | 'call'
  | 'whatsapp'
  | 'visit'
  | 'free_session'
  | 'follow_up';

// Log Entry (Interaction)
export interface LogEntry {
  date: string;
  type: InteractionType;
  note: string;
}

// Lead
export interface Lead {
  lead_id: string;
  child_name: string;
  parent_name: string;
  child_age: number;
  phone: string;
  location: string;
  lead_source: LeadSource;
  logs: LogEntry[];
  status: LeadStatus;
  free_session: 'yes' | 'no';
  next_followup: string | null;
  created_date: string;
  updated_date: string;
}

// Subscription Type
export type SubscriptionType = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

// Student Status
export type StudentStatus = 'active' | 'inactive' | 'expired';

// Student
export interface Student {
  student_id: string;
  child_name: string;
  parent_name: string;
  child_age: number;
  phone: string;
  location: string;
  joined_date: string;
  subscription_type: SubscriptionType;
  subscription_end: string;
  lead_id: string | null;
  status: StudentStatus;
}

// Sidebar Items
export interface IsidebarItems {
  title: string;
  url: string;
  icon: React.ElementType;
}