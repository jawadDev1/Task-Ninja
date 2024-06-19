import admin from "./firebaseAdmin.js";

const db = admin.database();
const dbRef = db.ref();

export const saveToken = async (userId, token) => {
  const userTokensRef = dbRef.child(`userTokens/${userId}/`);
  const snapshot = await userTokensRef.get();
  const values = snapshot.val() ?? {};
  const payload = { ...values, token };
  await userTokensRef.set(payload);
};

export const getToken = async (userId) => {
  const userTokensRef = dbRef.child(`userTokens/${userId}/`);
  const snapshot = await userTokensRef.get();
  return snapshot.val() ?? {};
};
