import {HttpErrorResponse} from '@angular/common/http'; // Import HttpErrorResponse

export enum StatusNotificationEnum { 
  OK ='OK',
  ERROR= 'ERROR',
  INIT = 'INIT'
}

export class State<T, V = HttpErrorResponse> {
  value?: T;
  error?: V | HttpErrorResponse;
  status: StatusNotificationEnum;

  constructor(status: StatusNotificationEnum, value?: T, error?: V | HttpErrorResponse) {
    this.value = value;
    this.error = error;
    this.status = status;
  }

  static Builder<T = any, V = HttpErrorResponse>() {
    return new StateBuilder<T, V>();
  }
}

class StateBuilder<T, V = HttpErrorResponse> {
  private status: StatusNotificationEnum = StatusNotificationEnum.INIT;
  private value?: T;
  private error?: V | HttpErrorResponse;

  public forSuccess(value: T): State<T, V> {
    this.status = StatusNotificationEnum.OK;
    this.value = value;
    return this.build();
  }

  public forError(error: V | HttpErrorResponse = new HttpErrorResponse({ error: 'Unknown Error' }), value?: T): State<T, V> {
    this.status = StatusNotificationEnum.ERROR;
    this.value = value;
    this.error = error;
    return this.build();
  }

  public forInit(): State<T, V> {
    this.status = StatusNotificationEnum.INIT;
    return this.build();
  }

  public build(){
    return new State<T, V>(this.status, this.value, this.error);
  }
}
