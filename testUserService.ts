import {
  loadUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile
} from './src/services/firebase/userService.js';
import { Timestamp } from 'firebase/firestore';



async function run() {
  const uid = 'serviceTest';

  // 1) Create ➞ genau zwei Argumente: uid + data
  await createUserProfile(uid, {
    email: 'a@b.com',
    displayName: 'SvcTester',
    subscriptionStatus: 'pending',
    firstName: 'Svc',
    lastName: 'Tester',
    sex: 'D',
    birthdate: Timestamp.fromDate(new Date(1990, 0, 1)),
  });
  console.log('✅ createUserProfile OK');

  // 2) Read
  const user = await loadUserProfile(uid);
  console.log('✅ loadUserProfile:', user);

  // 3) Update
  await updateUserProfile(uid, { displayName: 'SvcUpdated' });
  console.log('✅ updateUserProfile OK');

  // 4) Delete
  await deleteUserProfile(uid);
  console.log('✅ deleteUserProfile OK');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
