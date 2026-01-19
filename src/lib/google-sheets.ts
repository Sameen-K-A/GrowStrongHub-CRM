import { google, sheets_v4 } from 'googleapis';
import type { Lead, Student, LogEntry, LeadSource, LeadStatus, InteractionType } from '@/types';

// Sheet column mappings
const LEADS_COLUMNS = {
  lead_id: 0,
  child_name: 1,
  parent_name: 2,
  child_age: 3,
  phone: 4,
  location: 5,
  lead_source: 6,
  logs: 7,
  status: 8,
  free_session: 9,
  next_followup: 10,
  created_date: 11,
  updated_date: 12,
};

const STUDENTS_COLUMNS = {
  student_id: 0,
  child_name: 1,
  parent_name: 2,
  child_age: 3,
  phone: 4,
  location: 5,
  joined_date: 6,
};

// Cache the Google Sheets client to avoid re-authentication on every call
let cachedSheetsClient: sheets_v4.Sheets | null = null;

function getGoogleSheetsClient(): sheets_v4.Sheets {
  if (cachedSheetsClient) {
    return cachedSheetsClient;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  cachedSheetsClient = google.sheets({ version: 'v4', auth });
  return cachedSheetsClient;
}

// Helper: Generate next ID (L001, L002... or S001, S002...)
function generateNextId(existingIds: string[], prefix: string): string {
  if (existingIds.length === 0) {
    return `${prefix}001`;
  }

  const numbers = existingIds
    .map(id => parseInt(id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));

  const maxNumber = Math.max(...numbers, 0);
  const nextNumber = maxNumber + 1;
  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
}

// Helper: Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// ==================== LEADS ====================

export async function getLeads(): Promise<Lead[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.LEADS_GOOGLE_SHEET_ID;

  const sheetName = process.env.LEADS_SHEET_NAME || 'Sheet1';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:M`, // Skip header row
  });

  const rows = response.data.values || [];

  return rows.map((row): Lead => ({
    lead_id: row[LEADS_COLUMNS.lead_id] || '',
    child_name: row[LEADS_COLUMNS.child_name] || '',
    parent_name: row[LEADS_COLUMNS.parent_name] || '',
    child_age: parseInt(row[LEADS_COLUMNS.child_age], 10) || 0,
    phone: row[LEADS_COLUMNS.phone] || '',
    location: row[LEADS_COLUMNS.location] || '',
    lead_source: (row[LEADS_COLUMNS.lead_source] || 'Direct') as LeadSource,
    logs: row[LEADS_COLUMNS.logs] ? JSON.parse(row[LEADS_COLUMNS.logs]) : [],
    status: (row[LEADS_COLUMNS.status] || 'cold') as LeadStatus,
    free_session: (row[LEADS_COLUMNS.free_session] || 'no') as 'yes' | 'no',
    next_followup: row[LEADS_COLUMNS.next_followup] || null,
    created_date: row[LEADS_COLUMNS.created_date] || '',
    updated_date: row[LEADS_COLUMNS.updated_date] || '',
  }));
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await getLeads();
  return leads.find(lead => lead.lead_id === id) || null;
}

export async function createLead(data: {
  child_name: string;
  parent_name: string;
  child_age: number;
  phone: string;
  location: string;
  lead_source: LeadSource;
}): Promise<Lead> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.LEADS_GOOGLE_SHEET_ID;

  // Get existing leads to generate next ID
  const existingLeads = await getLeads();
  const existingIds = existingLeads.map(l => l.lead_id);
  const newId = generateNextId(existingIds, 'L');
  const today = getTodayDate();

  const newLead: Lead = {
    lead_id: newId,
    child_name: data.child_name,
    parent_name: data.parent_name,
    child_age: data.child_age,
    phone: data.phone,
    location: data.location,
    lead_source: data.lead_source,
    logs: [],
    status: 'cold',
    free_session: 'no',
    next_followup: null,
    created_date: today,
    updated_date: today,
  };

  // Append row to sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${process.env.LEADS_SHEET_NAME || 'Sheet1'}!A:M`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        newLead.lead_id,
        newLead.child_name,
        newLead.parent_name,
        String(newLead.child_age),
        newLead.phone,
        newLead.location,
        newLead.lead_source,
        JSON.stringify(newLead.logs),
        newLead.status,
        newLead.free_session,
        newLead.next_followup || '',
        newLead.created_date,
        newLead.updated_date,
      ]],
    },
  });

  return newLead;
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.LEADS_GOOGLE_SHEET_ID;

  // Find the row index
  const leads = await getLeads();
  const rowIndex = leads.findIndex(lead => lead.lead_id === id);

  if (rowIndex === -1) return null;

  const existingLead = leads[rowIndex];
  const updatedLead: Lead = {
    ...existingLead,
    ...data,
    updated_date: getTodayDate(),
  };

  // Update the row (row index + 2 because of header and 0-indexing)
  const sheetRow = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${process.env.LEADS_SHEET_NAME || 'Sheet1'}!A${sheetRow}:M${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        updatedLead.lead_id,
        updatedLead.child_name,
        updatedLead.parent_name,
        String(updatedLead.child_age),
        updatedLead.phone,
        updatedLead.location,
        updatedLead.lead_source,
        JSON.stringify(updatedLead.logs),
        updatedLead.status,
        updatedLead.free_session,
        updatedLead.next_followup || '',
        updatedLead.created_date,
        updatedLead.updated_date,
      ]],
    },
  });

  return updatedLead;
}

export async function addLogToLead(
  id: string,
  log: { type: InteractionType; note: string },
  nextFollowup?: string | null
): Promise<Lead | null> {
  const lead = await getLeadById(id);
  if (!lead) return null;

  const newLog: LogEntry = {
    date: getTodayDate(),
    type: log.type,
    note: log.note,
  };

  const updatedLogs = [...lead.logs, newLog];

  return updateLead(id, {
    logs: updatedLogs,
    next_followup: nextFollowup !== undefined ? nextFollowup : lead.next_followup,
  });
}

// ==================== STUDENTS ====================

export async function getStudents(): Promise<Student[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.STUDENTS_GOOGLE_SHEET_ID;

  const sheetName = process.env.STUDENTS_SHEET_NAME || 'Sheet1';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:G`, // Skip header row
  });

  const rows = response.data.values || [];

  return rows.map((row): Student => ({
    student_id: row[STUDENTS_COLUMNS.student_id] || '',
    child_name: row[STUDENTS_COLUMNS.child_name] || '',
    parent_name: row[STUDENTS_COLUMNS.parent_name] || '',
    child_age: parseInt(row[STUDENTS_COLUMNS.child_age], 10) || 0,
    phone: row[STUDENTS_COLUMNS.phone] || '',
    location: row[STUDENTS_COLUMNS.location] || '',
    joined_date: row[STUDENTS_COLUMNS.joined_date] || '',
  }));
}

export async function getStudentById(id: string): Promise<Student | null> {
  const students = await getStudents();
  return students.find(student => student.student_id === id) || null;
}

export async function createStudent(data: {
  child_name: string;
  parent_name: string;
  child_age: number;
  phone: string;
  location: string;
  joined_date: string;
}): Promise<Student> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.STUDENTS_GOOGLE_SHEET_ID;

  // Get existing students to generate next ID
  const existingStudents = await getStudents();
  const existingIds = existingStudents.map(s => s.student_id);
  const newId = generateNextId(existingIds, 'S');

  const newStudent: Student = {
    student_id: newId,
    child_name: data.child_name,
    parent_name: data.parent_name,
    child_age: data.child_age,
    phone: data.phone,
    location: data.location,
    joined_date: data.joined_date,
  };

  // Append row to sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${process.env.STUDENTS_SHEET_NAME || 'Sheet1'}!A:G`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        newStudent.student_id,
        newStudent.child_name,
        newStudent.parent_name,
        String(newStudent.child_age),
        newStudent.phone,
        newStudent.location,
        newStudent.joined_date,
      ]],
    },
  });

  return newStudent;
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student | null> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.STUDENTS_GOOGLE_SHEET_ID;

  // Find the row index
  const students = await getStudents();
  const rowIndex = students.findIndex(student => student.student_id === id);

  if (rowIndex === -1) return null;

  const existingStudent = students[rowIndex];
  const updatedStudent: Student = {
    ...existingStudent,
    ...data,
  };

  // Update the row (row index + 2 because of header and 0-indexing)
  const sheetRow = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${process.env.STUDENTS_SHEET_NAME || 'Sheet1'}!A${sheetRow}:G${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        updatedStudent.student_id,
        updatedStudent.child_name,
        updatedStudent.parent_name,
        String(updatedStudent.child_age),
        updatedStudent.phone,
        updatedStudent.location,
        updatedStudent.joined_date,
      ]],
    },
  });

  return updatedStudent;
}