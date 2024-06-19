import admin from "firebase-admin";
import serviceAccount from "../task-ninja-firebase-private-key.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;