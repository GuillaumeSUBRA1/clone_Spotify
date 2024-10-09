import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ListSongCardComponent } from '../shared/list-song-card/list-song-card.component';
import { SongContentService } from '../service/song-content.service';
import { ReadSong, SongContent } from '../model/song.model';
import {Howl} from "howler";
import { StatusNotificationEnum } from '../model/state.model';
import { FavoriteBtnComponent } from '../shared/favorite-btn/favorite-btn.component';

@Component({
  selector: 'player',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, ListSongCardComponent, FavoriteBtnComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  songContentService = inject(SongContentService);

  current?: SongContent = undefined;
  currentHowl: Howl | undefined;

  playing = false;
  muted = false;
  volume = 0.5;

  nextQueue: Array<SongContent> = []
  previousQueue: Array<SongContent> = []

  constructor() {
    this.listenQueue();
    this.listenPlay();
  }

  listenQueue() {
    effect(() => {
      const queue = this.songContentService.queue();
      if (queue.length > 0) {
        this.newQueue(queue);
      }
    });
  }

  listenPlay() {
    effect(() => {
      if (this.songContentService.play().status === StatusNotificationEnum.OK) {
        this.nextSong();
      }
    })
  }

  newQueue(queue: Array<ReadSong>) {
    this.nextQueue = queue;
    this.playNext();
  }

  playNext() {
    if (this.nextQueue.length > 0) {
      this.playing = false;
      if (this.current) {
        this.previousQueue.unshift(this.current);
      }
      const next = this.nextQueue.shift();
      this.songContentService.nextSong(next!);
    }
  }

  nextSong() {
    this.current = this.songContentService.play().value!;
    const howl = new Howl({
      src: [`data:${this.current!.fileContentType};base64,${this.current!.file}`],
      volume: this.volume,
      onplay: () => this.onPlay(),
      onpause: () => this.onPause(),
      onend: () => this.onEnd(),
    });

    if (this.currentHowl) {
      this.currentHowl.stop();
    }

    howl.play();
    this.currentHowl = howl;
  }

  onPlay() {
    this.playing = true;
  }

  onPause() {
    this.playing = false;
  }

  onEnd() {
    this.playNext();
    this.playing = false;
  }

  onForward() {
    this.playNext();
  }

  onBackward() {
    if (this.previousQueue.length > 0) {
      this.playing = false;
      if (this.current) {
        this.nextQueue.unshift(this.current);
      }
      const previous = this.previousQueue.shift();
      this.songContentService.nextSong(previous!);
    }
    this.playNext();
  }

  pause() {
    if (this.currentHowl) {
      this.currentHowl.pause();
    }
  }

  play() {
    if (this.currentHowl) {
      this.currentHowl.play();
    }
  }

  mute() {
    if (this.currentHowl) {
      this.muted = !this.muted;
      this.currentHowl.mute(this.muted);
      if (this.muted) {
        this.volume = 0;
      } else {
        this.volume = 0;
        this.currentHowl.volume(this.volume);
      }
    }
  }

  onVolumeChange(newVolume: number) {
    this.volume = newVolume / 100;
    if (this.currentHowl) {
      this.currentHowl.volume(this.volume);
      if (this.volume === 0) {
        this.muted = true;
        this.currentHowl.mute(this.muted);
      } else if (this.muted) {
        this.muted = false;
        this.currentHowl.mute(this.muted);
      }
    }
  }
}
