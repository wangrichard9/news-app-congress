import { auth, db } from "../Firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

class FirebaseService {
async createUser(username, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), { username, email, createdAt: new Date() });
    return { uid, username, email };
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
}


  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const userData = await this.getUser(uid);
    return { uid, ...userData };
  }

  async getUser(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  }

  async updateUserPreferences(uid, preferences) {
    await setDoc(doc(db, "users", uid), { preferences }, { merge: true });
  }

  async getUserPreferences(uid) {
    const docSnap = await getDoc(doc(db, "users", uid));
    return docSnap.exists() ? docSnap.data()?.preferences : null;
  }
}

export default new FirebaseService();
