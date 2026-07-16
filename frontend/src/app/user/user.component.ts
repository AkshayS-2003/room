// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-user',
//   templateUrl: './user.component.html',
//   styleUrls: ['./user.component.css']
// })
// export class UserComponent implements OnInit {

//   constructor(private http: HttpClient,
//     private router:Router
//   ) { }

//   ngOnInit(): void {
//   }

//   userArray: any[]=[];

//   vchr_name: string=''
//   int_phone: string = ''
//   vchr_place: string = ''
//   username: string='';
//   password: string ='';

//   currentUser = '';

//   saveRecords(){

//     let bodyData = {
//       vchr_name : this.vchr_name,
//       int_phone : this.int_phone,
//       vchr_place: this.vchr_place,
//       username : this.username,
//       password: this.password
//     };

//     this.http.post(
//       `${environment.apiUrl}/user_reg/`,
//       bodyData
//     ).subscribe((resultData: any) =>{
//       console.log(resultData);
//       alert("Registration Successful");

//       this.clearForm();
//     });
//   }

//   clearForm(){
//     this.vchr_name = '';
//     this.int_phone = '';
//     this.vchr_place = '';
//     this.password = '';
//     this.username = '';

//     this.currentUser = '';

//   }

// }



import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  userArray: any[] = [];

  vchr_name: string = '';
  int_phone: string = '';
  vchr_place: string = '';
  username: string = '';
  password: string = '';

  currentUser = '';

  // Validation error messages
  nameError: string = '';
  phoneError: string = '';
  placeError: string = '';
  usernameError: string = '';
  passwordError: string = '';

  // Validation flags
  isNameValid: boolean = false;
  isPhoneValid: boolean = false;
  isPlaceValid: boolean = false;
  isUsernameValid: boolean = false;
  isPasswordValid: boolean = false;

  // Password visibility
  showPassword: boolean = false;

  // Form submission state
  isSubmitting: boolean = false;

  // Password requirement getters
  get hasMinLength(): boolean {
    return (this.password?.length || 0) >= 6;
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.password || '');
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password || '');
  }

  get hasNumber(): boolean {
    return /\d/.test(this.password || '');
  }

  // Validation Methods
  validateName(): void {
    const name = this.vchr_name?.trim() || '';
    
    if (!name) {
      this.nameError = 'Full name is required';
      this.isNameValid = false;
    } else if (name.length < 2) {
      this.nameError = 'Name must be at least 2 characters';
      this.isNameValid = false;
    } else if (name.length > 50) {
      this.nameError = 'Name must be at most 50 characters';
      this.isNameValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      this.nameError = 'Name must contain only alphabets and spaces';
      this.isNameValid = false;
    } else {
      this.nameError = '';
      this.isNameValid = true;
    }
  }

  validatePhone(): void {
    const phone = this.int_phone?.toString().trim() || '';
    
    if (!phone) {
      this.phoneError = 'Phone number is required';
      this.isPhoneValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      this.phoneError = 'Phone number must be exactly 10 digits';
      this.isPhoneValid = false;
    } else {
      this.phoneError = '';
      this.isPhoneValid = true;
    }
  }

  validatePlace(): void {
    const place = this.vchr_place?.trim() || '';
    
    if (!place) {
      this.placeError = 'Place is required';
      this.isPlaceValid = false;
    } else if (place.length < 2) {
      this.placeError = 'Place must be at least 2 characters';
      this.isPlaceValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(place)) {
      this.placeError = 'Place must contain only alphabets and spaces';
      this.isPlaceValid = false;
    } else {
      this.placeError = '';
      this.isPlaceValid = true;
    }
  }

  validateUsername(): void {
    const username = this.username?.trim() || '';
    
    if (!username) {
      this.usernameError = 'Username is required';
      this.isUsernameValid = false;
    } else if (username.length < 3) {
      this.usernameError = 'Username must be at least 3 characters';
      this.isUsernameValid = false;
    } else if (username.length > 20) {
      this.usernameError = 'Username must be at most 20 characters';
      this.isUsernameValid = false;
    } else if (!/^[A-Za-z0-9_]+$/.test(username)) {
      this.usernameError = 'Username can only contain letters, numbers, and underscores';
      this.isUsernameValid = false;
    } else {
      this.usernameError = '';
      this.isUsernameValid = true;
    }
  }

  validatePassword(): void {
    const password = this.password || '';
    
    if (!password) {
      this.passwordError = 'Password is required';
      this.isPasswordValid = false;
    } else if (password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      this.isPasswordValid = false;
    } else if (password.length > 30) {
      this.passwordError = 'Password must be at most 30 characters';
      this.isPasswordValid = false;
    } else if (!/[a-z]/.test(password)) {
      this.passwordError = 'Password must contain at least one lowercase letter';
      this.isPasswordValid = false;
    } else if (!/[A-Z]/.test(password)) {
      this.passwordError = 'Password must contain at least one uppercase letter';
      this.isPasswordValid = false;
    } else if (!/\d/.test(password)) {
      this.passwordError = 'Password must contain at least one number';
      this.isPasswordValid = false;
    } else {
      this.passwordError = '';
      this.isPasswordValid = true;
    }
  }

  // Validate all fields
  validateAllFields(): void {
    this.validateName();
    this.validatePhone();
    this.validatePlace();
    this.validateUsername();
    this.validatePassword();
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.isNameValid && 
           this.isPhoneValid && 
           this.isPlaceValid && 
           this.isUsernameValid && 
           this.isPasswordValid;
  }

  // Get error count
  getErrorCount(): number {
    let count = 0;
    if (this.nameError) count++;
    if (this.phoneError) count++;
    if (this.placeError) count++;
    if (this.usernameError) count++;
    if (this.passwordError) count++;
    return count;
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Check password strength
  getPasswordStrength(): string {
    const password = this.password || '';
    if (!password) return '';
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (!strength) return '';
    if (strength === 'Weak') return '#ef4444';
    if (strength === 'Medium') return '#f59e0b';
    return '#22c55e';
  }

  getPasswordStrengthWidth(): string {
    const strength = this.getPasswordStrength();
    if (!strength) return '0%';
    if (strength === 'Weak') return '33%';
    if (strength === 'Medium') return '66%';
    return '100%';
  }

  saveRecords() {
  this.validateAllFields();

  if (!this.isFormValid()) {
    alert('Please fill all required fields correctly.');

    // Show errors for empty fields
    if (!this.vchr_name) {
      this.nameError = 'Full name is required';
    }

    if (!this.int_phone) {
      this.phoneError = 'Phone number is required';
    }

    if (!this.vchr_place) {
      this.placeError = 'Place is required';
    }

    if (!this.username) {
      this.usernameError = 'Username is required';
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
    }

    return;
  }

  // Registration code...
}

  clearForm() {
    this.vchr_name = '';
    this.int_phone = '';
    this.vchr_place = '';
    this.password = '';
    this.username = '';
    this.currentUser = '';

    // Clear validation states
    this.nameError = '';
    this.phoneError = '';
    this.placeError = '';
    this.usernameError = '';
    this.passwordError = '';
    this.isNameValid = false;
    this.isPhoneValid = false;
    this.isPlaceValid = false;
    this.isUsernameValid = false;
    this.isPasswordValid = false;
    this.isSubmitting = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}