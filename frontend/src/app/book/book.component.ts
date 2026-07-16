// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-book',
//   templateUrl: './book.component.html',
//   styleUrls: ['./book.component.css']
// })
// export class BookComponent implements OnInit {

//   constructor(private http: HttpClient,
//     private router: Router,
//     private route: ActivatedRoute
    
//   ) { }

//   schedule_id:any;
//   user_id:any;

//   ngOnInit(): void {
//     this.schedule_id = this.route.snapshot.paramMap.get('id');
//       this.user_id = localStorage.getItem("user_id");

//   console.log(this.schedule_id);

//   console.log("Schedule ID:", this.schedule_id);
// console.log("User ID:", this.user_id);
// console.log("Purpose:", this.vchr_purpose);

//   }

//   bookArray: any[]=[];

//   vchr_purpose : string = ''

//   saveData() {

//   let formData = new FormData();

//   formData.append("vchr_purpose", this.vchr_purpose);
//   formData.append("schedule_id", this.schedule_id);
//   formData.append("user_id", this.user_id);

//   this.http.post(
//     "http://127.0.0.1:8000/myapp/book_room/",
//     formData
//   ).subscribe((result: any) => {

//     console.log(result);

    

//     if(result.status === "success"){
//       alert("Room booked successfully");
//       this.router.navigate(['/avaliable']);
//     } else {
//       alert(result.message);
//     }

//   });

// }


  

// }


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  schedule_id: any;
  user_id: any;
  vchr_purpose: string = '';

  // Booking details
  scheduleDetails: any = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  bookingSuccess: boolean = false;

  // Validation
  purposeError: string = '';
  isPurposeValid: boolean = false;

  ngOnInit(): void {
    this.schedule_id = this.route.snapshot.paramMap.get('id');
    this.user_id = localStorage.getItem('user_id');

    console.log('Schedule ID:', this.schedule_id);
    console.log('User ID:', this.user_id);

    // Check if user is logged in
    if (!this.user_id) {
      alert('Please login to book a room');
      this.router.navigate(['/login']);
      return;
    }

    // Get schedule details
    if (this.schedule_id) {
      this.getScheduleDetails();
    }
  }

  // Get schedule details for display
  getScheduleDetails() {
    this.isLoading = true;
    this.http.get(`${environment.apiUrl}/view_schedule/${this.schedule_id}/`)
      .subscribe({
        next: (result: any) => {
          console.log('Schedule details:', result);
          this.scheduleDetails = result;
          this.isLoading = false;
        },
      });
  }

  // Validate Purpose
  validatePurpose(): void {
    const purpose = this.vchr_purpose?.trim() || '';

    if (!purpose) {
      this.purposeError = 'Purpose is required';
      this.isPurposeValid = false;
    } else if (purpose.length < 3) {
      this.purposeError = 'Purpose must be at least 3 characters';
      this.isPurposeValid = false;
    } else if (purpose.length > 500) {
      this.purposeError = 'Purpose must be at most 500 characters';
      this.isPurposeValid = false;
    } else if (!/^[A-Za-z0-9\s\-_,.!?()]+$/.test(purpose)) {
      this.purposeError = 'Purpose contains invalid characters';
      this.isPurposeValid = false;
    } else {
      this.purposeError = '';
      this.isPurposeValid = true;
    }
  }

  // Validate all fields
  validateAllFields(): boolean {
    this.validatePurpose();
    return this.isPurposeValid;
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.isPurposeValid;
  }

  // Get error count
  getErrorCount(): number {
    let count = 0;
    if (this.purposeError) count++;
    return count;
  }

  // Save booking data
  saveData() {
    // Validate
    if (!this.validateAllFields()) {
      alert(`Please fix ${this.getErrorCount()} error(s) before submitting.`);
      return;
    }

    // Check if user is logged in
    if (!this.user_id) {
      alert('Please login to book a room');
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;

    let formData = new FormData();
    formData.append("vchr_purpose", this.vchr_purpose.trim());
    formData.append("schedule_id", this.schedule_id);
    formData.append("user_id", this.user_id);

    this.http.post(
      `${environment.apiUrl}/book_room/`,
      formData
    ).subscribe({
      next: (result: any) => {
        console.log(result);
        this.isSubmitting = false;

        if (result.status === "success") {
          this.bookingSuccess = true;
          alert("Room booked successfully! 🎉");
          
          // Navigate after a short delay
          setTimeout(() => {
            this.router.navigate(['/avaliable']);
          }, 2000);
        } else {
          alert(result.message || 'Booking failed. Please try again.');
        }
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.isSubmitting = false;
        
        if (error.status === 400) {
          alert(error.error?.message || 'Invalid booking request. Please check your details.');
        } else if (error.status === 409) {
          alert('This room is already booked for the selected time slot.');
        } else {
          alert('Failed to book room. Please try again.');
        }
      }
    });
  }

  // Format time
  formatTime(time: string): string {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      const hourNum = parseInt(hours);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  }

  // Format date
  formatDate(date: string): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  }

  // Go back to available rooms
  goBack() {
    this.router.navigate(['/avaliable']);
  }

  // Reset form
  resetForm() {
    this.vchr_purpose = '';
    this.purposeError = '';
    this.isPurposeValid = false;
  }

  // Clear booking success state
  clearSuccess() {
    this.bookingSuccess = false;
  }
}