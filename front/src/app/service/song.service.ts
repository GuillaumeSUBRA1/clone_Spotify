import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { State } from "../model/state.model";
import { User } from "../model/user.model";
import { SaveSong } from "../model/song.model";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    http = inject(HttpClient);

    private addSongSignal: WritableSignal<State<SaveSong, HttpErrorResponse>> = signal(State.Builder<SaveSong, HttpErrorResponse>().forInit());
    addSong = computed(() => this.addSongSignal());

    add(song: SaveSong) {
        const formData = new FormData();
        formData.append('cover', song.cover!);
        formData.append('file', song.file!);
        const songClone = structuredClone(song);
        songClone.file = undefined;
        songClone.cover = undefined;
        formData.append('dto', JSON.stringify(songClone));
        this.http.post<SaveSong>(`${environment.API_URL}/song/add`, formData)
            .subscribe({
                next: s => this.addSongSignal.set(State.Builder<SaveSong, HttpErrorResponse>().forSuccess(s)),
                error: e => this.addSongSignal.set(State.Builder<SaveSong, HttpErrorResponse>().forError(e))
            })
            ;
    }

    reset() {
        this.addSongSignal.set(State.Builder<SaveSong, HttpErrorResponse>().forInit());
    }
}  