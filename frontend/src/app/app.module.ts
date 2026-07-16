import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoomComponent } from './room/room.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { BookComponent } from './book/book.component';
import { AvaliableComponent } from './avaliable/avaliable.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RoomComponent,
    ScheduleComponent,
    BookComponent,
    AvaliableComponent,
    ViewBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
