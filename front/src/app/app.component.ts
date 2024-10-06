import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavigationComponent } from './menu/navigation/navigation.component';
import { LibraryComponent } from './menu/library/library.component';
import { HeaderComponent } from './header/header.component';
import { ToastService } from './service/toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { PlayerComponent } from "./player/player.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, NavigationComponent, LibraryComponent, HeaderComponent, NgbToast, PlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  faIconLibrary = inject(FaIconLibrary);
  toastService = inject(ToastService);

  ngOnInit(): void {
    this.initIcons();
  }

  initIcons(){
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

}
