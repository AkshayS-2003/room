import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent implements OnInit {

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllBookingDetails();
  }

  BookArray: any[] = [];

  getAllBookingDetails(){
    this.http.get(`${environment.apiUrl}/view_booking`)
    .subscribe((resultData: any)=> {
      console.log(resultData);
      this.BookArray = resultData;
    })
  }

}
