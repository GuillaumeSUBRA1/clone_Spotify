import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReadSong } from '../../model/song.model';
import { SongService } from '../../service/song.service';
import { SongContentService } from '../../service/song-content.service';
import { ListSongCardComponent } from '../../shared/list-song-card/list-song-card.component';

@Component({
  selector: 'library',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterModule,
    ListSongCardComponent
],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit{
  songService = inject(SongService);
  songContentService = inject(SongContentService);

  songs: Array<ReadSong> = [];

  loading = false;

  constructor() {
    effect(() => {
      if(this.songService.getAllSongs().status === "OK") {
        this.songs = this.songService.getAllSongs().value!;
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.fetchSongs();
  }

  private fetchSongs() {
    this.loading = true;
    this.songService.getAll();
  }

  onPlaySong(first:ReadSong){
    this.songContentService.createQueue(first,this.songs)
  }

}
