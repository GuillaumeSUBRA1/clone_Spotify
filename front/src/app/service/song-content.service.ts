import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable, inject, WritableSignal, signal, computed } from "@angular/core";
import { ReadSong, SongContent } from "../model/song.model";
import { State } from "../model/state.model";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class SongContentService {
    http = inject(HttpClient);

    private queueSignal: WritableSignal<Array<ReadSong>> = signal([]);
    queue = computed(() => this.queueSignal());

    private playSignal: WritableSignal<State<SongContent, HttpErrorResponse>> = signal(State.Builder<SongContent, HttpErrorResponse>().forInit());
    play = computed(() => this.playSignal());

    constructor() { }

    createQueue(first: ReadSong, toPlay: Array<ReadSong>) {
        toPlay = toPlay.filter(s => s.pid !== first.pid);
        if (toPlay) {
            toPlay.unshift(first);
        }
        this.queueSignal.set(toPlay);
    }

    nextSong(toPlay: SongContent) {
        const params = new HttpParams().set("pid", toPlay.pid!);
        this.http.get<SongContent>(`${environment.API_URL}/song/content`, { params: params })
            .subscribe({
                next: s => {
                    this.mapSongContent(s, toPlay);
                    this.playSignal.set(State.Builder<SongContent, HttpErrorResponse>().forSuccess(s));
                },
                error: e => this.playSignal.set(State.Builder<SongContent, HttpErrorResponse>().forError(e))
            });
    }

    mapSongContent(song: SongContent, toPlay: SongContent) {
        song.cover = toPlay.cover;
        song.coverContentType = toPlay.coverContentType;
        song.title = toPlay.title;
        song.author = toPlay.author;
        song.favorite = toPlay.favorite;
    }
}