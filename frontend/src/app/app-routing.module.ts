import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./user/user.component";
import { RoomComponent } from "./room/room.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { AvaliableComponent } from "./avaliable/avaliable.component";
import { BookComponent } from "./book/book.component";
import { ViewBookingComponent } from "./view-booking/view-booking.component";


const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'user', component: UserComponent},
    { path: 'room',component:RoomComponent},
    { path: 'schedule/:id',component:ScheduleComponent},
    { path: 'avaliable',component:AvaliableComponent},
    { path: 'book/:id',component:BookComponent},
    {path: 'view_booking',component:ViewBookingComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{ }