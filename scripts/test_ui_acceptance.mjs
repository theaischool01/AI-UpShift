import fs from 'fs';
import path from 'path';

const SRC = path.resolve('c:/Users/Saheel/Desktop/UpShift-1/src');

function assertNoMatch(filePath, regex, desc) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(regex);
  if (match) {
    throw new Error(`FAIL: Found forbidden pattern [${desc}] in ${filePath}: "${match[0]}"`);
  }
  console.log(`PASS: No [${desc}] in ${path.basename(filePath)}`);
}

function assertMatch(filePath, regex, desc) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(regex);
  if (!match) {
    throw new Error(`FAIL: Expected pattern [${desc}] NOT found in ${filePath}`);
  }
  console.log(`PASS: Found [${desc}] in ${path.basename(filePath)}`);
}

console.log('\n--- VERIFYING ACCEPTANCE CRITERIA ---');

// 1. StudentsPage.jsx
const studentsPage = path.join(SRC, 'pages/admin/StudentsPage.jsx');
assertNoMatch(studentsPage, /All UpShift Tracks/i, 'All UpShift Tracks');
assertNoMatch(studentsPage, /ASSIGNED TRACK/i, 'ASSIGNED TRACK column header');
assertNoMatch(studentsPage, /M1|M2|M3|M4|M5|M6/g, 'M1-M6 track filters in student page');
assertMatch(studentsPage, /UpShift/g, 'UpShift program label');

// 2. AddStudentPage.jsx
const addStudentPage = path.join(SRC, 'pages/admin/AddStudentPage.jsx');
assertNoMatch(addStudentPage, /UpShift Track/i, 'UpShift Track label');
assertNoMatch(addStudentPage, /Select an UpShift track/i, 'Track selector dropdown');
assertNoMatch(addStudentPage, /trackId/i, 'trackId state/validation');
assertMatch(addStudentPage, /Add Student/i, 'Add Student header');

// 3. BulkStudentImportPage.jsx
const bulkImportPage = path.join(SRC, 'pages/admin/BulkStudentImportPage.jsx');
assertNoMatch(bulkImportPage, /track_id/i, 'track_id requirement in CSV headers');
assertMatch(bulkImportPage, /'full_name',\s*'email',\s*'college_email',\s*'college',\s*'password'/i, 'Canonical CSV template');

// 4. AdminDashboardPage.jsx
const adminDashboard = path.join(SRC, 'pages/admin/AdminDashboardPage.jsx');
assertNoMatch(adminDashboard, /Track Distribution/i, 'Track Distribution panel');
assertNoMatch(adminDashboard, /Top Track/i, 'Top Track');

// 5. AnalyticsPage.jsx
const analyticsPage = path.join(SRC, 'pages/admin/AnalyticsPage.jsx');
assertNoMatch(analyticsPage, /Track Distribution/i, 'Track Distribution');
assertNoMatch(analyticsPage, /Track Diversity/i, 'Track Diversity');
assertNoMatch(analyticsPage, /Top Track/i, 'Top Track');
assertNoMatch(analyticsPage, /All UpShift Tracks/i, 'All UpShift Tracks');

// 6. RecentRegistrationsTable.jsx
const recentTable = path.join(SRC, 'components/admin/RecentRegistrationsTable.jsx');
assertNoMatch(recentTable, /Assigned Track/i, 'Assigned Track column');
assertMatch(recentTable, /UpShift/i, 'Program: UpShift');

// 7. GigsPage.jsx
const gigsPage = path.join(SRC, 'pages/admin/GigsPage.jsx');
assertMatch(gigsPage, /Module/i, 'Module column for opportunities');

console.log('\n--- ALL ACCEPTANCE CRITERIA PASSED CLEANLY ---');
