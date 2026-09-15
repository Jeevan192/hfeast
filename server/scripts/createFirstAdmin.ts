import { auth, db, FieldValue } from '../src/config/firebase.js';

async function bootstrapFirstAdmin() {
  const emailArg = process.argv[2]?.trim().toLowerCase();

  if (!emailArg) {
    console.error('❌ Usage: npm run create-admin <admin-email> [password]');
    console.error('Example: npm run create-admin superadmin@cbithacktoberfest.in "SecurePass123!"');
    process.exit(1);
  }

  const passwordArg = process.argv[3] || 'Hacktoberfest2026!';

  console.log(`🔐 Bootstrapping first superadmin: ${emailArg}...`);

  let userRecord;

  try {
    userRecord = await auth.getUserByEmail(emailArg);
    console.log(`ℹ️ Existing Firebase Auth user found with UID: ${userRecord.uid}`);
  } catch (err: unknown) {
    if ('code' in (err as { code: unknown }) && (err as { code: string }).code === 'auth/user-not-found') {
      console.log('👤 User not found in Firebase Auth. Creating new user...');
      userRecord = await auth.createUser({
        email: emailArg,
        password: passwordArg,
        emailVerified: true,
      });
      console.log(`✅ Firebase Auth user created successfully with UID: ${userRecord.uid}`);
    } else {
      throw err;
    }
  }

  // Create or update admins/{uid} document with role 'superadmin'
  const adminRef = db.collection('admins').doc(userRecord.uid);
  const now = FieldValue.serverTimestamp();

  await adminRef.set(
    {
      uid: userRecord.uid,
      email: emailArg,
      role: 'superadmin',
      updatedAt: now,
      createdAt: now,
    },
    { merge: true }
  );

  console.log(`🎉 Superadmin doc successfully initialized in 'admins/${userRecord.uid}'!`);
  console.log(`   Email: ${emailArg}`);
  console.log(`   Role: superadmin`);
  console.log('You can now log in using Firebase Auth client SDK or generate an ID token for admin API calls.');
  process.exit(0);
}

bootstrapFirstAdmin().catch((err) => {
  console.error('❌ Error creating first superadmin:', err);
  process.exit(1);
});
