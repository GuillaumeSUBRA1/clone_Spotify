import { FormControl } from "@angular/forms";

export interface TitleValue {
    value?: string;
}

export interface AuthorValue {
    value?: string;
}

export interface BaseSong {
    pid?: string;
    title?: TitleValue;
    author?: AuthorValue;
}

export interface SaveSong extends BaseSong {
    file?: File;
    fileContentType?: string;
    cover?: File;
    coverContentType?: string;
}

export type AddSongForm = {
    title: FormControl<string>;
    author: FormControl<string>;
    cover: FormControl<File | null>;
    file: FormControl<File | null>;
}

export interface ReadSong extends BaseSong {
    cover?: string;
    coverContentType?: string;
    favorite: boolean;
    play: boolean;
}