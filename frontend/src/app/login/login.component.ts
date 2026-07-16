import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  username: string = ''
  password: string = ''

  goToRegister(){
    this.router.navigate(['/user']);
  }

  login(){

    let bodyData = {
      username: this.username,
      password: this.password,
    };

     this.http.post(`${environment.apiUrl}/login/`, bodyData).subscribe(
      (resultData: any) =>{
        console.log(resultData);
        console.log("Role",resultData.role);

        if (resultData.status == "success"){
          localStorage.setItem("user_id",resultData.user_id);
          console.log("Stored user_id", localStorage.getItem("user_id"));

          alert("Login Successful");

          if (resultData.role ==="admin"){
            this.router.navigate(['/room']);
          }

          else if (resultData.role ==="user"){
            this.router.navigate(['/avaliable']);
          }
        }

        else{

          alert("Invalid Username or Password")
        }
      },
      (error) => {
        console.log(error);
        alert("server Error")
      }
     );
  }

}
