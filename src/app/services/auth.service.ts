import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IUsers from '../model/users.model';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap } from 'rxjs/operators'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUsers>;
  public isAuthenticated$ : Observable<boolean>;
  public isAuthticatedWithDelay$ : Observable<boolean>;
  public redirect = false;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth, private router: Router, private route: ActivatedRoute) {
    this.usersCollection = store.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );
    this.isAuthticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1500)
    );

    this.router.events.pipe(
      filter(el => el instanceof NavigationEnd),
      map(el => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data?.authOnly ?? false;
    })
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

  async signOut() {
    await this.auth.signOut();

    if(this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
