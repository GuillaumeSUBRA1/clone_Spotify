import { Component, effect, inject, OnInit } from '@angular/core';
import { FavoriteBtnComponent } from '../shared/favorite-btn/favorite-btn.component';
import { ListSongCardComponent } from '../shared/list-song-card/list-song-card.component';
import { ReadSong } from '../model/song.model';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';
import { StatusNotificationEnum } from '../model/state.model';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [FavoriteBtnComponent, ListSongCardComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  songs:Array<ReadSong> = [];

  songService = inject(SongService);
  songContentService = inject(SongContentService);
  toastService=inject(ToastService);

  constructor(){
    this.listenGetFavorites();
    this.listenManageFavorites();
  }

  ngOnInit(): void {
    this.songService.getFavorites();
  }

  listenGetFavorites(){
    effect(()=>{
      const state = this.songService.getAllFavorite();
      if(state.status === StatusNotificationEnum.OK){
        state.value!.forEach(s => s.favorite = true);
        this.songs = state.value!;
      }
    });
  }

  listenManageFavorites(){
    effect(()=>{
      const state = this.songService.manageFavoriteSongs();
      if(state.status === StatusNotificationEnum.OK){
        this.songService.getFavorites();
      }
    });
  }

  onPlay(first:ReadSong){
    this.songContentService.createQueue(first,this.songs);
  }
}
