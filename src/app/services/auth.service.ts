import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IUsers from '../model/users.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUsers>;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {
    this.usersCollection = store.collection('users');
  }

  async registerUser(userData: IUsers) {
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password as string
    );

    if(userCred.user) {
      await this.usersCollection.doc(userCred.user.uid).set({
        name: userData.name,
        email: userData.email,
        age: userData.age,
        phoneNumber: userData.phoneNumber,
      });

      await userCred.user.updateProfile({
        displayName: userData.name,
      })
    }
  }
}
