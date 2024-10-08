import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavigationComponent } from './menu/navigation/navigation.component';
import { LibraryComponent } from './menu/library/library.component';
import { HeaderComponent } from './header/header.component';
import { ToastService } from './service/toast.service';
import { NgbModal, NgbModalRef, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { PlayerComponent } from "./player/player.component";
import { AuthService } from './service/auth.service';
import { AuthPopupStateEnum } from './model/user.model';
import { AuthPopupComponent } from './menu/auth-popup/auth-popup.component';

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
  authService = inject(AuthService);
  modalService = inject(NgbModal);

  authPopup: NgbModalRef | null = null;

  constructor() {
    effect(() => {
      this.openOrCloseAuthModal(this.authService.authPopup())
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.initIcons();
  }

  initIcons() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  openOrCloseAuthModal(state: AuthPopupStateEnum) {
    if (state === AuthPopupStateEnum.OPEN) {
      this.openPopup();
    } else if (this.authPopup !== null && state === AuthPopupStateEnum.CLOSE && this.modalService.hasOpenModals()) {
      this.authPopup.close();
    }
  }

  openPopup() {
    this.authPopup = this.modalService.open(AuthPopupComponent, {
      ariaDescribedBy: 'auth-modal',
      centered: true
    });

    this.authPopup.dismissed.subscribe({
      next: () => this.authService.openOrCloseAuthPopup(AuthPopupStateEnum.CLOSE) 
    });
    this.authPopup.closed.subscribe({
      next: () => this.authService.openOrCloseAuthPopup(AuthPopupStateEnum.CLOSE)
    });
  }
}
