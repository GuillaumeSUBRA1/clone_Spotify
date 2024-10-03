export interface TitleValue{
    value?:string;
}

export interface AuthorValue{
    value?:string;
}

export interface BaseSong{
    pid?:string;
    title?:TitleValue;
    author?:AuthorValue;
}

export interface SaveSong extends BaseSong{
    file?:File;
    fileContentType?:string;
    cover?:File;
    coverContentType:string;
}