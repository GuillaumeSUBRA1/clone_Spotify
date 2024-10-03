import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { State } from '../model/state.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  location = inject(Location);
  notConnected = "NOT_CONNECTED";

  private fetchUserWritable: WritableSignal<State<User,HttpErrorResponse>> = signal(State.Builder<User,HttpErrorResponse>().forSuccess({ email: this.notConnected }));
  fetchUser = computed(() => this.fetchUserWritable());

  fetch() {
    this.http.get<User>(`${environment.API_URL}/auth/get_authenticated_user`).subscribe({
        next: u => this.fetchUserWritable.set(State.Builder<User,HttpErrorResponse>().forSuccess(u)),
        error: e => {
          if (e.status === HttpStatusCode.Unauthorized && this.isAuthenticated()) {
            this.fetchUserWritable.set(State.Builder<User,HttpErrorResponse>().forSuccess({ email: this.notConnected }))
          } else {
            this.fetchUserWritable.set(State.Builder<User,HttpErrorResponse>().forError(e));
          }
        },
      });
  }

  isAuthenticated(): boolean {
    if (this.fetchUserWritable().value) {
      return this.fetchUserWritable().value!.email !== this.notConnected;
    }
    return false;
  }

  login() {
    location.href = `${location.origin}${this.location.prepareExternalUrl("oauth2/authorization/okta")}`;
  }

  logout() {
    this.http.post(`${environment.API_URL}/auth/logout`, {}, {withCredentials: true}).subscribe(
      {
        next: () => {
          this.fetchUserWritable.set(State.Builder<User,HttpErrorResponse>().forSuccess({ email: this.notConnected }));
          location.href = environment.API_URL;
        },
      }
    );
  }
}
