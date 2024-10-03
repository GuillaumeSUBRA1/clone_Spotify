import { Component, effect, inject, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { User } from '../model/user.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StatusNotificationEnum } from '../model/state.model';
import { Location } from '@angular/common';

@Component({
  selector: 'header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  authService = inject(AuthService);
  location = inject(Location);

  connectedUser:User={email:this.authService.notConnected};

  constructor(){
    effect(()=>{
      if(this.authService.fetchUser().status === StatusNotificationEnum.OK){
        this.connectedUser = this.authService.fetchUser().value!;
      }
    });
  }

  ngOnInit(): void {
    this.authService.fetch();
  }

  login(){
    this.authService.login();
  }

  logout(){
    this.authService.logout();
  }

  goBackward(){
    this.location.back();
  }

  goForward(){
    this.location.forward();
  }

}
