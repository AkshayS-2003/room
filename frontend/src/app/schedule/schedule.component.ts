// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';


// @Component({
//   selector: 'app-schedule',
//   templateUrl: './schedule.component.html',
//   styleUrls: ['./schedule.component.css']
// })
// export class ScheduleComponent implements OnInit {

//   constructor(private http: HttpClient,
//     private router: Router,
//     private route: ActivatedRoute

//   ) { }

//   room_id: any;


//   ngOnInit(): void {
//     this.room_id = this.route.snapshot.paramMap.get('id');
//   console.log(this.room_id);

//   this.getAllSchedule();
//   }

//   ScheduleArray: any[] = [];

//   from_time: string = '';
//   to_time : string = '';
//   date: string = '';

//   currentScheduleID = '';


//   saveSchedules(){
//     let formData = new FormData();

//     formData.append("from_time",this.from_time);
//     formData.append("to_time",this.to_time);
//     formData.append("date",this.date);
//     formData.append("room_id", this.room_id);


//     this.http.post("http://127.0.0.1:8000/myapp/add_schedule/",formData)
//     .subscribe((resultData: any)=>{
//       console.log(resultData);
//       alert("schedule added")

//       this.clearSchedule();
//       this.getAllSchedule();
//     })
//   }


//   getAllSchedule(){
//     this.http.get("http://127.0.0.1:8000/myapp/view_schedule")
//     .subscribe((resultData: any) =>{
//       console.log(resultData);
//       this.ScheduleArray = resultData;
//     });
//   }


//   clearSchedule(){
//     this.date = '';
//     this.from_time = '';
//     this.to_time = '';

//     this.currentScheduleID = '';
//   }

// }


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  room_id: any;
  room_name: string = '';

  ngOnInit(): void {
    this.room_id = this.route.snapshot.paramMap.get('id');
    console.log('Room ID:', this.room_id);
    
    // Get room name from navigation state or fetch it
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.room_name = navigation.extras.state['roomName'] || 'Room';
    }
    
    this.getAllSchedule();
  }

  ScheduleArray: any[] = [];

  from_time: string = '';
  to_time: string = '';
  date: string = '';

  currentScheduleID = '';

  // Validation error messages
  dateError: string = '';
  fromTimeError: string = '';
  toTimeError: string = '';
  timeRangeError: string = '';

  // Validation flags
  isDateValid: boolean = false;
  isFromTimeValid: boolean = false;
  isToTimeValid: boolean = false;
  isTimeRangeValid: boolean = false;

  // Get today's date in YYYY-MM-DD format
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Validate Date
  validateDate(): void {
    if (!this.date) {
      this.dateError = 'Date is required';
      this.isDateValid = false;
      return;
    }

    const selectedDate = new Date(this.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.dateError = 'Date cannot be in the past. Please select today or a future date';
      this.isDateValid = false;
    } else {
      this.dateError = '';
      this.isDateValid = true;
    }
  }

  // Validate From Time
  validateFromTime(): void {
    if (!this.from_time) {
      this.fromTimeError = 'From time is required';
      this.isFromTimeValid = false;
      return;
    }

    // Check if from_time is valid time format
    const timeParts = this.from_time.split(':');
    if (timeParts.length !== 2) {
      this.fromTimeError = 'Invalid time format';
      this.isFromTimeValid = false;
      return;
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      this.fromTimeError = 'Invalid time';
      this.isFromTimeValid = false;
      return;
    }

    this.fromTimeError = '';
    this.isFromTimeValid = true;
    
    // Re-validate time range if both times are set
    if (this.to_time) {
      this.validateTimeRange();
    }
  }

  // Validate To Time
  validateToTime(): void {
    if (!this.to_time) {
      this.toTimeError = 'To time is required';
      this.isToTimeValid = false;
      return;
    }

    // Check if to_time is valid time format
    const timeParts = this.to_time.split(':');
    if (timeParts.length !== 2) {
      this.toTimeError = 'Invalid time format';
      this.isToTimeValid = false;
      return;
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      this.toTimeError = 'Invalid time';
      this.isToTimeValid = false;
      return;
    }

    this.toTimeError = '';
    this.isToTimeValid = true;
    
    // Re-validate time range if both times are set
    if (this.from_time) {
      this.validateTimeRange();
    }
  }

  // Validate Time Range (To time must be after From time)
  validateTimeRange(): void {
    if (!this.from_time || !this.to_time) {
      this.timeRangeError = '';
      this.isTimeRangeValid = false;
      return;
    }

    const fromDate = new Date(`2000-01-01T${this.from_time}`);
    const toDate = new Date(`2000-01-01T${this.to_time}`);

    if (toDate <= fromDate) {
      this.timeRangeError = 'To time must be after From time';
      this.isTimeRangeValid = false;
    } else {
      // Check if time range is at least 30 minutes
      const diffMinutes = (toDate.getTime() - fromDate.getTime()) / (1000 * 60);
      if (diffMinutes < 30) {
        this.timeRangeError = 'Time range must be at least 30 minutes';
        this.isTimeRangeValid = false;
      } else if (diffMinutes > 480) { // 8 hours
        this.timeRangeError = 'Time range cannot exceed 8 hours';
        this.isTimeRangeValid = false;
      } else {
        this.timeRangeError = '';
        this.isTimeRangeValid = true;
      }
    }
  }

  // Check if date is today
  isDateToday(): boolean {
    if (!this.date) return false;
    const selectedDate = new Date(this.date);
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }

  // Validate all fields
  validateAllFields(): void {
    this.validateDate();
    this.validateFromTime();
    this.validateToTime();
    if (this.from_time && this.to_time) {
      this.validateTimeRange();
    }
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.isDateValid && 
           this.isFromTimeValid && 
           this.isToTimeValid && 
           this.isTimeRangeValid;
  }

  // Get error count
  getErrorCount(): number {
    let count = 0;
    if (this.dateError) count++;
    if (this.fromTimeError) count++;
    if (this.toTimeError) count++;
    if (this.timeRangeError) count++;
    return count;
  }

  saveSchedules() {
    this.validateAllFields();

    if (!this.isFormValid()) {
      alert(`Please fix ${this.getErrorCount()} error(s) before submitting.`);
      return;
    }

    // Check for overlapping schedules (optional client-side check)
    this.checkOverlappingSchedule().then((hasOverlap) => {
      if (hasOverlap) {
        if (!confirm('This time slot might overlap with existing schedules. Do you want to continue?')) {
          return;
        }
      }

      let formData = new FormData();

      formData.append("from_time", this.from_time);
      formData.append("to_time", this.to_time);
      formData.append("date", this.date);
      formData.append("room_id", this.room_id);

      this.http.post(`${environment.apiUrl}/add_schedule/`, formData)
        .subscribe({
          next: (resultData: any) => {
            console.log(resultData);
            alert("Schedule added successfully ✅");
            this.clearSchedule();
            this.getAllSchedule();
          },
          error: (error) => {
            console.error('Error:', error);
            alert('Failed to add schedule. Please try again.');
          }
        });
    });
  }

  // Check for overlapping schedules (optional)
  async checkOverlappingSchedule(): Promise<boolean> {
    try {
      const response = await this.http.get<any[]>(`${environment.apiUrl}/view_schedule`).toPromise();
      const schedules = response || [];
      
      // Filter schedules for the same room and date
      const roomSchedules = schedules.filter(s => s.fk_ROOM?.id == this.room_id || s.room_id == this.room_id);
      
      for (const schedule of roomSchedules) {
        const existingDate = new Date(schedule.date);
        const selectedDate = new Date(this.date);
        
        if (existingDate.toDateString() !== selectedDate.toDateString()) {
          continue;
        }
        
        const existingFrom = schedule.from_time;
        const existingTo = schedule.to_time;
        
        // Check if time ranges overlap
        const newFrom = this.from_time;
        const newTo = this.to_time;
        
        if (newFrom < existingTo && newTo > existingFrom) {
          return true; // Overlap found
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking overlap:', error);
      return false;
    }
  }

  getAllSchedule() {
    this.http.get(`${environment.apiUrl}/view_schedule`)
      .subscribe({
        next: (resultData: any) => {
          console.log(resultData);
          this.ScheduleArray = resultData;
        },
        error: (error) => {
          console.error('Error fetching schedules:', error);
        }
      });
  }

  clearSchedule() {
    this.date = '';
    this.from_time = '';
    this.to_time = '';
    this.currentScheduleID = '';

    // Clear validation states
    this.dateError = '';
    this.fromTimeError = '';
    this.toTimeError = '';
    this.timeRangeError = '';
    this.isDateValid = false;
    this.isFromTimeValid = false;
    this.isToTimeValid = false;
    this.isTimeRangeValid = false;
  }

  goBackToRooms() {
    this.router.navigate(['/rooms']);
  }
}
