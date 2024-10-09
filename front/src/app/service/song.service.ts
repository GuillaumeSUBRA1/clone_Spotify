import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { State } from "../model/state.model";
import { ReadSong, SaveSong } from "../model/song.model";
import { environment } from "../../environments/environment.development";
import { catchError, map, of } from "rxjs";
import { ToastService } from "./toast.service";
import { ToastTypeEnum } from "../model/toast.model";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    http = inject(HttpClient);
    toastService = inject(ToastService);

    private addSongSignal: WritableSignal<State<SaveSong, HttpErrorResponse>> = signal(State.Builder<SaveSong, HttpErrorResponse>().forInit());
    addSong = computed(() => this.addSongSignal());

    private getAllSongsSignal: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> = signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit());
    getAllSongs = computed(() => this.getAllSongsSignal());

    private manageFavoriteSongsSignal: WritableSignal<State<ReadSong, HttpErrorResponse>> = signal(State.Builder<ReadSong, HttpErrorResponse>().forInit());
    manageFavoriteSongs = computed(() => this.manageFavoriteSongsSignal());

    private getAllFavoriteSignal: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> = signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit());
    getAllFavorite = computed(() => this.getAllFavoriteSignal());

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

    manageFavorite(fav:boolean, pid:string){
        const params = new HttpParams().set("pid", pid);
        return this.http.post<ReadSong>(`${environment.API_URL}/song/like`, { params })
        .subscribe({
            next: s => {
                this.manageFavoriteSongsSignal.set(State.Builder<ReadSong, HttpErrorResponse>().forSuccess(s));
                if(s.favorite){
                    this.toastService.show("Song Added to favorites",ToastTypeEnum.SUCCESS);
                } else {
                    this.toastService.show("Song removed of favorites",ToastTypeEnum.SUCCESS);
                }
            },
            error: e => {
                this.getAllSongsSignal.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(e));
                this.toastService.show("Error when adding song to favorites",ToastTypeEnum.DANGER);
            }
        });
    }

    getFavorites(){
        this.http.get<Array<ReadSong>>(`${environment.API_URL}/song/get-favorite`)
        .subscribe({
            next: s => this.getAllFavoriteSignal.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(s)),
            error: e => this.getAllFavoriteSignal.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(e))
        });

    }

    reset() {
        this.addSongSignal.set(State.Builder<SaveSong, HttpErrorResponse>().forInit());
    }
}  