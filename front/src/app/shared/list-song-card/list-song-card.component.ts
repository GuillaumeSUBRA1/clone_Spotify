import { Component, EventEmitter, input, Output } from '@angular/core';
import { ReadSong } from '../../model/song.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'list-song-card',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './list-song-card.component.html'
})
export class ListSongCardComponent {
  song = input.required<ReadSong>();

  @Output() songToPlay = new EventEmitter<ReadSong>();

  play(){
    this.songToPlay.next(this.song())
  }
}
