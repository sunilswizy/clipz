import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}

  login() {
    console.log('submitted...');
  }
}
