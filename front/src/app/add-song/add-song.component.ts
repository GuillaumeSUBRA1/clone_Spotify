import { Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AddSongForm, AuthorValue, SaveSong, TitleValue } from '../model/song.model';
import { SongService } from '../service/song.service';
import { Router } from '@angular/router';
import { ToastService } from '../service/toast.service';
import { FlowStatusEnum } from '../model/flow.model';
import { StatusNotificationEnum } from '../model/state.model';
import { ToastTypeEnum } from '../model/toast.model';

@Component({
  selector: 'add-song',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule, FontAwesomeModule],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})
export class AddSongComponent implements OnDestroy {
  song: SaveSong = {};

  formBuilder = inject(FormBuilder);
  songService = inject(SongService);
  router = inject(Router);
  toastService = inject(ToastService);

  creating = false;

  status = FlowStatusEnum.INIT;
  flowStatus = FlowStatusEnum;


  createForm = this.formBuilder.nonNullable.group<AddSongForm>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cover: new FormControl(null),
    file: new FormControl(null, { nonNullable: true, validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      this.creating = false;
      if (this.songService.addSong().status === StatusNotificationEnum.OK) {
        this.songService.getAll();
        this.toastService.show('Song created successfully', ToastTypeEnum.SUCCESS);
        this.router.navigate(['/']);
      } else if (this.songService.addSong().status === StatusNotificationEnum.ERROR) {
        this.toastService.show('Error occured while createing song, try again', ToastTypeEnum.DANGER);

      }
    });
  }

  ngOnDestroy(): void {
    this.songService.reset();
  }

  create() {
    this.creating = true;
    if (this.song.cover === null) {
      this.status = FlowStatusEnum.VALIDATION_COVER_ERROR;
    }
    if (this.song.file === null) {
      this.status = FlowStatusEnum.VALIDATION_FILE_ERROR;
    }

    this.song.title = { value: this.createForm.value.title };
    this.song.author = { value: this.createForm.value.author };

    this.songService.add(this.song);
  }

  getFile(target: EventTarget | null) {
    const inputTarget = target as HTMLInputElement;
    if (target === null || inputTarget.files === null) {
      return null
    }
    return inputTarget.files[0];
  }

  uploadCover(target: EventTarget | null) {
    const cover = this.getFile(target);
    if (cover !== null) {
      this.song.cover = cover;
      this.song.coverContentType = cover.type;
    }
  }

  uploadFile(target: EventTarget | null) {
    const file = this.getFile(target);
    if (file !== null) {
      if (file.name.split("-").length === 2) {
        this.createForm.patchValue({
          title: file.name.split("-")[1].trim().split(".mp3")[0].split(".wma")[0],
          author: file.name.split("-")[0].trim(),
        });
      }
      this.song.file = file;
      this.song.fileContentType = file.type;
    }
  }

}
