import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RentLength } from '../models/rentLength';
import { RentLengthService } from '../rent-length.service';

@Component({
  selector: 'app-admin-change-rent-time',
  templateUrl: './admin-change-rent-time.component.html',
  styleUrls: ['./admin-change-rent-time.component.css']
})
export class AdminChangeRentTimeComponent implements OnInit {

  constructor(private rentLengthService: RentLengthService, private router: Router) { }

  ngOnInit(): void {
    this.filter()
    this.rentLengthService.getRentLength().subscribe((resp: any)=>{
      if(resp.message == "Ok"){
        this.rentLen = resp.length
      }
    });
  }

  rentLen: number = -1;
  newRentLen: number = 14;
  errorMessage: string = "";

  filter() {
    if (localStorage.getItem('loggedUser') != null) {
      const user = JSON.parse(localStorage.getItem('loggedUser'));
      if (user.type != 'admin') {
        this.router.navigate(['userHomepage']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

  setNewRentDays(){
    if(this.newRentLen == undefined){
      alert("Unesite novi broj dana");
      return;
    }
    if(this.newRentLen <= 0){
      alert("Unesite broj dana veci od 0");
      return;
    }
    const data = {
      length: this.newRentLen
    };
    this.rentLengthService.setRentLength(data).subscribe((res: any)=>{
      if(res.message == "Ok"){
        alert("Uspesno menjanje dana");
        window.location.reload();
      }
    })
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['']);
  }
}
