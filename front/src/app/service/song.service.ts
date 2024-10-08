import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { State } from "../model/state.model";
import { ReadSong, SaveSong } from "../model/song.model";
import { environment } from "../../environments/environment.development";
import { catchError, map, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    http = inject(HttpClient);

    private addSongSignal: WritableSignal<State<SaveSong, HttpErrorResponse>> = signal(State.Builder<SaveSong, HttpErrorResponse>().forInit());
    addSong = computed(() => this.addSongSignal());

    private getAllSongsSignal: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> = signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit());
    getAllSongs = computed(() => this.getAllSongsSignal());

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
            });
    }

    getAll() {
        this.http.get<Array<ReadSong>>(`${environment.API_URL}/song/all`)
            .subscribe({
                next: s => this.getAllSongsSignal.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(s)),
                error: e => this.getAllSongsSignal.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(e))
            });
    }

    search(s: string) {
        const params = new HttpParams().set("search", s);
        return this.http.get<Array<ReadSong>>(`${environment.API_URL}/song/search`, { params })
            .pipe(
                map(s=>State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(s)),
                catchError(e => of(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(e)))
            );
    }

    reset() {
        this.addSongSignal.set(State.Builder<SaveSong, HttpErrorResponse>().forInit());
    }
}  