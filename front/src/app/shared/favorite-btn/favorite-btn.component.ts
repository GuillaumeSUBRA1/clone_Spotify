import { Component, effect, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReadSong } from '../../model/song.model';
import { AuthService } from '../../service/auth.service';
import { SongService } from '../../service/song.service';
import { StatusNotificationEnum } from '../../model/state.model';

@Component({
  selector: 'favorite-btn',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './favorite-btn.component.html',
  styleUrl: './favorite-btn.component.scss'
})
export class FavoriteBtnComponent {
  song = input.required<ReadSong>();

  authService = inject(AuthService);
  songService = inject(SongService);

  constructor(){
    this.listenFavorite();
  }

  listenFavorite(){
    effect(()=>{
      const state = this.songService.manageFavoriteSongs();
      if(state.status == StatusNotificationEnum.OK && state.value && this.song().pid === state.value.pid){
        this.song().favorite = state.value.favorite;
      }
    });
  }

  onFavorite(s:ReadSong){
    this.songService.manageFavorite(!s.favorite,s.pid!);
  }
}
