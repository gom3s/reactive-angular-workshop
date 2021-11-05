import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Hero {
    id: number;
    name: string;
    description: string;
    thumbnail: HeroThumbnail;
    resourceURI: string;
    comics: HeroSubItems;
    events: HeroSubItems;
    series: HeroSubItems;
    stories: HeroSubItems;
}

export interface HeroThumbnail {
    path: string;
    extendion: string;
}

export interface HeroSubItems {
    available: number;
    returned: number;
    collectionURI: string;
    items: HeroSubItem[];
}

export interface HeroSubItem {
    resourceURI: string;
    name: string;
}

// The URL to the Marvel API
const HERO_API = `${environment.MARVEL_API.URL}/v1/public/characters`;

// Our Limits for Search
const LIMIT_LOW = 10;
const LIMIT_MID = 25;
const LIMIT_HIGH = 100;
const LIMITS = [LIMIT_LOW, LIMIT_MID, LIMIT_HIGH];
export const DEFAULT_SEARCH = '';
export const DEFAULT_LIMIT = LIMIT_HIGH;
export const DEFAULT_PAGE = 0;

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;
    _limit = LIMIT_LOW;
    searchBS = new BehaviorSubject(DEFAULT_SEARCH);
    limitBS = new BehaviorSubject(DEFAULT_LIMIT);
    pageBS = new BehaviorSubject(DEFAULT_PAGE);
    userPage$ = this.pageBS.pipe(map(p => p + 1));

    params$ = combineLatest([this.searchBS, this.limitBS, this.pageBS]).pipe(
        map(([searchTerm, limit, page]) => {
            const params = {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${limit}`,
                // nameStartsWith: 'hulk', // once we have search
                offset: `${page * limit}`, // page * limit
            };
            if (searchTerm.length) {
                params['nameStartsWith'] = searchTerm;
            }

            return params;
        }),
    );

    heroesResponse$ = this.params$.pipe(
        debounceTime(500),
        switchMap(params =>
            this.http.get(HERO_API, {
                params,
            }),
        ),
        shareReplay(1),
    );

    totalResults$ = this.heroesResponse$.pipe(
        map((res: any) => res.data.total),
    );
    heroes$ = this.heroesResponse$.pipe(map((res: any) => res.data.results));

    totalPages$ = combineLatest([this.totalResults$, this.limitBS]).pipe(
        map(([totalResults, limit]) => Math.ceil(totalResults / limit)),
    );

    constructor(private http: HttpClient) {}

    setLimit(limit) {
        this._limit = limit;
        return this.http
            .get(HERO_API, {
                params: {
                    apikey: environment.MARVEL_API.PUBLIC_KEY,
                    limit: `${this._limit}`,
                    // nameStartsWith: 'hulk', // once we have search
                    offset: `${0}`, // page * limit
                },
            })
            .pipe(map((res: any) => res.data.results));
    }
}
