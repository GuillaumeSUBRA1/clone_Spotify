import { Injectable } from '@angular/core';
import { Toast, ToastTypeEnum } from '../model/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toast: Toast[] = [];

  show(body: string, type: ToastTypeEnum) {
    let name;
    if (type === ToastTypeEnum.DANGER) {
      name = 'bg-danger text-light';
    } else {
      name = 'bg-success text-light';
    }
    const info: Toast = { name, body };
    this.toast.push(info);
  }

  remove(t: Toast) {
    this.toast = this.toast.filter(to => to != t);
  }
}
