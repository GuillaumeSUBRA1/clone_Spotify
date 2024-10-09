import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ListSongCardComponent } from '../shared/list-song-card/list-song-card.component';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';
import { ReadSong } from '../model/song.model';
import { ToastService } from '../service/toast.service';
import { debounce, filter, interval, of, scan, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { State, StatusNotificationEnum } from '../model/state.model';
import { ToastTypeEnum } from '../model/toast.model';
import { FavoriteBtnComponent } from "../shared/favorite-btn/favorite-btn.component";

@Component({
  selector: 'search',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, ListSongCardComponent, FavoriteBtnComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  search = '';

  songService = inject(SongService);
  songContentService = inject(SongContentService);
  toastService = inject(ToastService);
  
  result: Array<ReadSong> = [];

  searching = false;

  onSearch(newSearch:string){
    this.search = newSearch;
    of(newSearch).pipe(
      tap(newSearch=>this.reset(newSearch)),
      filter(newSearch=>newSearch.length>0),
      debounce(()=>interval(300)),
      tap(()=>this.searching=true),
      switchMap(newSearch=>this.songService.search(newSearch))
    ).subscribe({
      next: s => this.next(s)
    });
  }

  reset(s:string){
    if(s.length === 0){
      this.result = [];
    }
  }

  onPlay(first :ReadSong){
    this.songContentService.createQueue(first,this.result);
  }

  next(state:State<Array<ReadSong>, HttpErrorResponse>){
    this.searching = false;
    if(state.status === StatusNotificationEnum.OK){
      this.result = state.value!;
    } else if(state.status === StatusNotificationEnum.ERROR){
      this.toastService.show('An error occured', ToastTypeEnum.DANGER);
    }
  }
}
