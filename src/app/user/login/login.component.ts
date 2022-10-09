import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface ICredentials {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials: ICredentials = {
    email: '',
    password: '',
  };

  submitting = false;
  showAlert = false;
  alertMsg = '';
  alertColor = 'green';

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    const { email, password}  = this.credentials;
    this.submitting = true;
    this.alertMsg = 'please wait...';
    this.alertColor = 'orange'
    try {
      const userCred = await this.auth.signInWithEmailAndPassword(email, password);
    }
    catch(e: any) {
      this.alertColor = 'red';
      this.showAlert = true;
      this.submitting = false;
      switch(e.code) {
        case 'auth/user-not-found' : {
          this.alertMsg = 'Invalid email, account not found!'
          break;
        }
        case 'auth/wrong-password': {
          this.alertMsg = 'Invalid password, password not match!'
          break;
        }
        default: {
          this.alertMsg = 'something went wrong, please try again later!'
        }
      }
      return 
    }
    this.showAlert = true;
    this.alertColor = 'green';
    this.alertMsg = 'successfully logged...!'
  }
}
