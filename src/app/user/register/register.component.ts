import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUsers from 'src/app/model/users.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  constructor(private auth: AuthService) {
  }

  submitting = false;
  showAlert = false;
  alertMsg = 'please wait form is registering';
  alertColor = 'green';
  

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(99),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl<number | null>(null, [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  });

  async register() {
    this.showAlert = true;
    this.alertMsg = 'please wait form is registering';
    this.alertColor = 'orange';
    this.submitting = true;

    try {
      await this.auth.registerUser(this.registerForm.value as IUsers)
    }
    catch(e: any) {
      this.alertColor = 'red';
      this.submitting = false;
      if(e.code === 'auth/email-already-in-use')
         {
          this.alertMsg = 'registerd email already in use!'
        }
        else {
          this.alertMsg = 'something went wrong, please try again later!'
        }
      return 
    }

    this.alertMsg = 'successfully your account created!';
    this.alertColor = 'green'
    // this.resetForm();
  }

  resetForm() {
    this.email.setValue('');
    this.password.setValue('');
    this.age.setValue(null);
    this.password.setValue('');
    this.confirmPassword.setValue('');
    this.phoneNumber.setValue(null);
  }
}
