import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongComponent } from './song/song.component';
import { SongService } from '../service/song.service';
import { ToastService } from '../service/toast.service';
import { ReadSong } from '../model/song.model';
import { StatusNotificationEnum } from '../model/state.model';
import { ToastTypeEnum } from '../model/toast.model';
import { SongContentService } from '../service/song-content.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [FontAwesomeModule, SongComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  songService = inject(SongService);
  toastService = inject(ToastService);
  songContentService = inject(SongContentService);

  songs: Array<ReadSong> = [];

  constructor() {
    this.listenGetAll();
  }

  listenGetAll(){
    effect(() => {
      const state = this.songService.getAllSongs();
      if (state.status === StatusNotificationEnum.OK) {
        this.songs = state.value!;
      } else if (state.status === StatusNotificationEnum.ERROR) {
        this.toastService.show("An error occured when fecthing songs", ToastTypeEnum.DANGER);
      }
    });
  }

  playSong(first: ReadSong){
    this.songContentService.createQueue(first,this.songs);
  }
}
