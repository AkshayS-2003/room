// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {  Router } from '@angular/router';

// @Component({
//   selector: 'app-room',
//   templateUrl: './room.component.html',
//   styleUrls: ['./room.component.css']
// })
// export class RoomComponent implements OnInit {

//   constructor(private http:HttpClient,
//     private router: Router

//   ) { }

//   ngOnInit(): void {
//     this.getAllRoom();
//   }

//   RoomArray: any[] = [];

//   vchr_name: string='';
//   int_size : string = '';
//   vchr_purpose : string= '';
//   int_rent: string='';
//   selectedFile!: File;

//   currentRoomID = '';

//   onFileSelected(event:any){
//     this.selectedFile = event.target.files[0];

//     console.log(this.selectedFile);
//   }

//   saveRecords(){

//     let formData = new FormData();

//     formData.append("vchr_name",this.vchr_name);
//     formData.append("int_size",this.int_size);
//     formData.append("vchr_purpose",this.vchr_purpose);
//     formData.append("int_rent",this.int_rent);

//     if (this.selectedFile){
//       formData.append("image",this.selectedFile);
//     }

//     this.http.post("http://127.0.0.1:8000/myapp/meating_room/",formData)
//     .subscribe((resultData: any) => {
//       console.log(resultData);
//       alert("Room Added Successfully");

//       this.clearForm();
//       this.getAllRoom();
//     });
//   }

//   getAllRoom(){
//     this.http.get("http://127.0.0.1:8000/myapp/meating_room/").subscribe((resultData: any) =>{
//       console.log(resultData);
//       this.RoomArray = resultData;
//     });
//   }

//   goToBooking(){
//     this.router.navigate(['/view_booking']);
//   }

//   setUpdate(data:any){

//     this.vchr_name = data.vchr_name;
//     this.int_size = data.int_size;
//     this.int_rent = data.int_rent;
//     this.vchr_purpose = data.vchr_purpose;

//     this.currentRoomID = data.id;
//   }

//   UpdateRecords(){
//     let bodyData = {
//       "vchr_name":this.vchr_name,
//       "int_size" : this.int_size,
//       "vchr_purpose": this.vchr_purpose,
//       "int_rent" : this.int_rent
//     };

//     this.http.put("http://127.0.0.1:8000/myapp/meating_room/" + this.currentRoomID + "/", bodyData)
//     .subscribe((resultData:any) => {

//       console.log(resultData);
//       alert("Room Details Updated");

//       this.clearForm();
//       this.getAllRoom();
//     })
//   }

//   setDelete(data: any){
    
//     this.http.delete("http://127.0.0.1:8000/myapp/meating_room/" + data.id + "/")
//     .subscribe((resultData: any) => {
//       console.log(resultData);
//       alert("Deleted Successfully");

//       this.getAllRoom();
//     })
//   }

//   clearForm(){

//     this.vchr_name = '';
//     this.int_rent = '';
//     this.vchr_purpose = '';
//     this.int_size = '';

//     this.currentRoomID = '';
//   }

// goToSchedule(roomItem: any) {
//   this.router.navigate(['/schedule', roomItem.id]);
// }

// }



import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllRoom();
  }

  RoomArray: any[] = [];

  vchr_name: string = '';
  int_size: string = '';
  vchr_purpose: string = '';
  int_rent: string = '';
  selectedFile!: File;

  currentRoomID = '';

  // Validation error messages
  nameError: string = '';
  sizeError: string = '';
  purposeError: string = '';
  rentError: string = '';
  imageError: string = '';

  // Validation flags
  isNameValid: boolean = false;
  isSizeValid: boolean = false;
  isPurposeValid: boolean = false;
  isRentValid: boolean = false;
  isImageValid: boolean = true; // Optional image

  // Validation Methods
  validateName(): void {
    const name = this.vchr_name?.trim() || '';
    
    if (!name) {
      this.nameError = 'Room name is required';
      this.isNameValid = false;
    } else if (name.length < 2) {
      this.nameError = 'Room name must be at least 2 characters';
      this.isNameValid = false;
    } else if (name.length > 50) {
      this.nameError = 'Room name must be at most 50 characters';
      this.isNameValid = false;
    } else if (!/^[A-Za-z0-9\s\-_]+$/.test(name)) {
      this.nameError = 'Room name can only contain letters, numbers, spaces, hyphens, and underscores';
      this.isNameValid = false;
    } else {
      this.nameError = '';
      this.isNameValid = true;
    }
  }

  validateSize(): void {
    const size = this.int_size?.toString().trim() || '';
    const sizeNum = parseInt(size);
    
    if (!size) {
      this.sizeError = 'Room size is required';
      this.isSizeValid = false;
    } else if (isNaN(sizeNum) || sizeNum < 1) {
      this.sizeError = 'Room size must be at least 1 person';
      this.isSizeValid = false;
    } else if (sizeNum > 500) {
      this.sizeError = 'Room size cannot exceed 500 persons';
      this.isSizeValid = false;
    } else if (!/^\d+$/.test(size)) {
      this.sizeError = 'Room size must be a valid number';
      this.isSizeValid = false;
    } else {
      this.sizeError = '';
      this.isSizeValid = true;
    }
  }

  validatePurpose(): void {
    const purpose = this.vchr_purpose?.trim() || '';
    
    if (!purpose) {
      this.purposeError = 'Room purpose is required';
      this.isPurposeValid = false;
    } else if (purpose.length < 3) {
      this.purposeError = 'Purpose must be at least 3 characters';
      this.isPurposeValid = false;
    } else if (purpose.length > 200) {
      this.purposeError = 'Purpose must be at most 200 characters';
      this.isPurposeValid = false;
    } else {
      this.purposeError = '';
      this.isPurposeValid = true;
    }
  }

  validateRent(): void {
    const rent = this.int_rent?.toString().trim() || '';
    const rentNum = parseInt(rent);
    
    if (!rent) {
      this.rentError = 'Room rent is required';
      this.isRentValid = false;
    } else if (isNaN(rentNum) || rentNum < 0) {
      this.rentError = 'Room rent must be a positive number';
      this.isRentValid = false;
    } else if (rentNum > 100000) {
      this.rentError = 'Room rent cannot exceed ₹100,000';
      this.isRentValid = false;
    } else if (!/^\d+$/.test(rent)) {
      this.rentError = 'Room rent must be a valid number';
      this.isRentValid = false;
    } else {
      this.rentError = '';
      this.isRentValid = true;
    }
  }

  validateImage(): void {
    if (this.selectedFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.imageError = 'Only JPEG, PNG, GIF, and WebP images are allowed';
        this.isImageValid = false;
      } else if (this.selectedFile.size > maxSize) {
        this.imageError = 'Image size must be less than 5MB';
        this.isImageValid = false;
      } else {
        this.imageError = '';
        this.isImageValid = true;
      }
    } else {
      // Image is optional, so it's valid if not provided
      this.imageError = '';
      this.isImageValid = true;
    }
  }

  // Validate all fields
  validateAllFields(): void {
    this.validateName();
    this.validateSize();
    this.validatePurpose();
    this.validateRent();
    this.validateImage();
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.isNameValid && 
           this.isSizeValid && 
           this.isPurposeValid && 
           this.isRentValid && 
           this.isImageValid;
  }

  // Get error count
  getErrorCount(): number {
    let count = 0;
    if (this.nameError) count++;
    if (this.sizeError) count++;
    if (this.purposeError) count++;
    if (this.rentError) count++;
    if (this.imageError) count++;
    return count;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.validateImage();
  }

  saveRecords() {
    this.validateAllFields();

    if (!this.isFormValid()) {
      alert(`Please fix ${this.getErrorCount()} error(s) before submitting.`);
      return;
    }

    let formData = new FormData();

    formData.append("vchr_name", this.vchr_name.trim());
    formData.append("int_size", this.int_size.toString().trim());
    formData.append("vchr_purpose", this.vchr_purpose.trim());
    formData.append("int_rent", this.int_rent.toString().trim());

    if (this.selectedFile) {
      formData.append("image", this.selectedFile);
    }

    console.log(`${environment.apiUrl}/meating_room/`);

    this.http.post(`${environment.apiUrl}/meating_room/`, formData)
      .subscribe({
        next: (resultData: any) => {
          console.log(resultData);
          alert("Room Added Successfully");
          this.clearForm();
          this.getAllRoom();
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to add room. Please try again.');
        }
      });
  }

  getAllRoom() {
    this.http.get(`${environment.apiUrl}/meating_room/`)
      .subscribe({
        next: (resultData: any) => {
          console.log(resultData);
          this.RoomArray = resultData;
        },
        error: (error) => {
          console.error('Error fetching rooms:', error);
        }
      });
  }

  goToBooking() {
    this.router.navigate(['/view_booking']);
  }

  setUpdate(data: any) {
    this.vchr_name = data.vchr_name;
    this.int_size = data.int_size.toString();
    this.int_rent = data.int_rent.toString();
    this.vchr_purpose = data.vchr_purpose;

    this.currentRoomID = data.id;

    // Re-validate after setting values
    this.validateAllFields();
  }

  UpdateRecords() {
    this.validateAllFields();

    if (!this.isFormValid()) {
      alert(`Please fix ${this.getErrorCount()} error(s) before updating.`);
      return;
    }

    let bodyData = {
      "vchr_name": this.vchr_name.trim(),
      "int_size": parseInt(this.int_size.toString().trim()),
      "vchr_purpose": this.vchr_purpose.trim(),
      "int_rent": parseInt(this.int_rent.toString().trim())
    };

    this.http.put(`${environment.apiUrl}/edit_meeting_room/` + this.currentRoomID + "/", bodyData)
      .subscribe({
        next: (resultData: any) => {
          console.log(resultData);
          alert("Room Details Updated ✅");
          this.clearForm();
          this.getAllRoom();
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to update room. Please try again.');
        }
      });
  }

  setDelete(data: any) {
    if (confirm(`Are you sure you want to delete "${data.vchr_name}"?`)) {
      this.http.delete(`${environment.apiUrl}/meating_room/` + data.id + "/")
        .subscribe({
          next: (resultData: any) => {
            console.log(resultData);
            alert("Deleted Successfully 🗑️");
            this.getAllRoom();
          },
          error: (error) => {
            console.error('Error:', error);
            alert('Failed to delete room. Please try again.');
          }
        });
    }
  }

  clearForm() {
    this.vchr_name = '';
    this.int_rent = '';
    this.vchr_purpose = '';
    this.int_size = '';
    this.selectedFile = undefined as any;
    this.currentRoomID = '';

    // Clear validation states
    this.nameError = '';
    this.sizeError = '';
    this.purposeError = '';
    this.rentError = '';
    this.imageError = '';
    this.isNameValid = false;
    this.isSizeValid = false;
    this.isPurposeValid = false;
    this.isRentValid = false;
    this.isImageValid = true;
  }

  goToSchedule(roomItem: any) {
    this.router.navigate(['/schedule', roomItem.id]);
  }
}