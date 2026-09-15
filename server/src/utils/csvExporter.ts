import { stringify } from 'csv-stringify';
import { Response } from 'express';
import { RegistrationWithTrackDoc } from '../models/registration.js';

/**
 * Escapes user-supplied strings to prevent CSV / Spreadsheet Formula Injection:
 * If a string begins with '=', '+', '-', or '@', it is prepended with a single quote (').
 */
export function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (str.length > 0 && ['=', '+', '-', '@'].includes(str.charAt(0))) {
    return `'${str}`;
  }
  return str;
}

export const CSV_HEADERS = [
  'Registration ID',
  'Team Name',
  'Team Size',
  'Status',
  'Checked In',
  'Track ID',
  'Problem Statement Title',
  'Problem Statement Domain',
  'Leader Name',
  'Leader Email',
  'Leader Phone',
  'Leader College',
  'Member 1 Name',
  'Member 1 Email',
  'Member 1 Phone',
  'Member 1 College',
  'Member 2 Name',
  'Member 2 Email',
  'Member 2 Phone',
  'Member 2 College',
  'Member 3 Name',
  'Member 3 Email',
  'Member 3 Phone',
  'Member 3 College',
  'GitHub URL',
  'Admin Note',
  'Created At',
  'Updated At',
];

function formatTimestamp(ts: unknown): string {
  if (!ts) return '';
  if (typeof (ts as { toDate?: () => Date }).toDate === 'function') {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  if (ts instanceof Date) {
    return ts.toISOString();
  }
  return String(ts);
}

export function streamRegistrationsToCsv(
  registrations: RegistrationWithTrackDoc[],
  res: Response
): void {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="cbit-hacktoberfest-registrations-${new Date().toISOString().slice(0, 10)}.csv"`
  );

  const stringifier = stringify({
    header: true,
    columns: CSV_HEADERS,
  });

  stringifier.pipe(res);

  for (const reg of registrations) {
    const m1 = reg.members?.[0];
    const m2 = reg.members?.[1];
    const m3 = reg.members?.[2];

    const row = [
      reg.id,
      escapeCsvField(reg.teamName),
      reg.teamSize,
      reg.status,
      reg.checkedIn ? 'Yes' : 'No',
      reg.trackId,
      escapeCsvField(reg.trackTitle || ''),
      escapeCsvField(reg.trackDomain || ''),
      escapeCsvField(reg.leader.name),
      reg.leader.email,
      reg.leader.phone,
      escapeCsvField(reg.leader.college),
      escapeCsvField(m1?.name),
      m1?.email || '',
      m1?.phone || '',
      escapeCsvField(m1?.college),
      escapeCsvField(m2?.name),
      m2?.email || '',
      m2?.phone || '',
      escapeCsvField(m2?.college),
      escapeCsvField(m3?.name),
      m3?.email || '',
      m3?.phone || '',
      escapeCsvField(m3?.college),
      escapeCsvField(reg.githubUrl),
      escapeCsvField(reg.adminNote),
      formatTimestamp(reg.createdAt),
      formatTimestamp(reg.updatedAt),
    ];

    stringifier.write(row);
  }

  stringifier.end();
}
