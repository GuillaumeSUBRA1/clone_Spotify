import { Component, input, OnInit } from '@angular/core';
import { ReadSong } from '../../model/song.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'song',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './song.component.html',
  styleUrl: './song.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ transform: 'translateY(10px)', opacity: 0 }),
            animate('.2s ease-out', style({ transform: 'translateY(0px)', opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ transform: 'translateY(0px)', opacity: 1 }),
            animate('.2s ease-in', style({ transform: 'translateY(10px)', opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class SongComponent implements OnInit {

  song = input.required<ReadSong>();
  display: ReadSong = { favorite: false, play: false };

  ngOnInit(): void {
    this.display = this.song();
  }

  hover(display: boolean) {
    this.display.play = display;
  }

}
