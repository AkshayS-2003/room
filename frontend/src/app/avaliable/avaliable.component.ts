// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-avaliable',
//   templateUrl: './avaliable.component.html',
//   styleUrls: ['./avaliable.component.css']
// })
// export class AvaliableComponent implements OnInit {

//   constructor(private http: HttpClient,
//     private router: Router
//   ) { }

//   ngOnInit(): void {

//     this.getAllSchedule();
//   }

//   ScheduleArray: any[] = [];



//   getAllSchedule(){
//     this.http.get("http://127.0.0.1:8000/myapp/view_schedule")
//     .subscribe((resultData: any) =>{
//       console.log(resultData);
//       this.ScheduleArray = resultData;
//     });
//   }

//   goToBook(ScheduleItem: any) {
//   this.router.navigate(['/book', ScheduleItem.id]);
// }

// }


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-avaliable',
  templateUrl: './avaliable.component.html',
  styleUrls: ['./avaliable.component.css']
})
export class AvaliableComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllSchedule();
  }

  ScheduleArray: any[] = [];
  filteredScheduleArray: any[] = [];
  
  // Search/filter properties
  searchTerm: string = '';
  filterDate: string = '';
  filterRoom: string = '';

  // Stats
  totalRooms: number = 0;
  uniqueRooms: number = 0;
  todayBookings: number = 0;

  getAllSchedule() {
    this.http.get(`${environment.apiUrl}/view_schedule`)
      .subscribe({
        next: (resultData: any) => {
          console.log(resultData);
          this.ScheduleArray = resultData;
          this.filteredScheduleArray = resultData;
          this.calculateStats();
        },
        error: (error) => {
          console.error('Error fetching schedules:', error);
          alert('Failed to load schedules. Please try again.');
        }
      });
  }

  // Calculate statistics
  calculateStats() {
    this.totalRooms = this.ScheduleArray.length;
    
    // Count unique rooms
    const uniqueRoomIds = new Set();
    this.ScheduleArray.forEach(item => {
      if (item.fk_ROOM?.id) {
        uniqueRoomIds.add(item.fk_ROOM.id);
      }
    });
    this.uniqueRooms = uniqueRoomIds.size;
    
    // Count today's bookings
    const today = new Date().toISOString().split('T')[0];
    this.todayBookings = this.ScheduleArray.filter(item => {
      return item.date === today;
    }).length;
  }
  // Clear filters
  clearFilters() {
    this.searchTerm = '';
    this.filterDate = '';
    this.filterRoom = '';
    this.filteredScheduleArray = this.ScheduleArray;
    this.calculateStats();
  }

  // Check if room is available for booking
  isRoomAvailable(scheduleItem: any): boolean {
    // You can add logic here to check if the room is already booked
    // For example, check if there's a booking for this schedule
    return true;
  }

  // Get booking status
  getBookingStatus(scheduleItem: any): string {
    // This would come from your backend
    // For now, return 'available' for all
    return 'available';
  }

  goToBook(ScheduleItem: any) {
    // Navigate with state data
    this.router.navigate(['/book', ScheduleItem.id], {
      state: {
        roomName: ScheduleItem.fk_ROOM?.vchr_name || 'Room',
        date: ScheduleItem.date,
        fromTime: ScheduleItem.from_time,
        toTime: ScheduleItem.to_time,
        rent: ScheduleItem.fk_ROOM?.int_rent || 0
      }
    });
  }

  // Refresh data
  refreshData() {
    this.getAllSchedule();
  }

  // Get today's date for filter
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Format time for display
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

  // Format date for display
  formatDate(date: string): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  }

  // Check if date is today
  isDateToday(date: string): boolean {
    if (!date) return false;
    return date === this.getTodayDate();
  }

  // Check if date is in the future
  isFutureDate(date: string): boolean {
    if (!date) return false;
    return date > this.getTodayDate();
  }

  // Check if date is in the past
  isPastDate(date: string): boolean {
    if (!date) return false;
    return date < this.getTodayDate();
  }
}