import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_PAGE, Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent implements OnInit {
    vm$ = combineLatest([
        this.hero.heroes$,
        this.hero.search$,
        this.hero.userPage$,
        this.hero.limit$,
        this.hero.totalResults$,
        this.hero.totalPages$,
    ]).pipe(
        map(([heroes, search, page, limit, totalResults, totalPages]) => ({
            heroes,
            search,
            page,
            limit,
            totalResults,
            totalPages,
            disableNext: totalPages === page,
            disablePrev: page === 1,
        })),
    );

    constructor(public hero: HeroService) {}

    ngOnInit() {}
    setLimit(limit) {
        this.hero.setLimit(limit);
    }

    doSearch(event: KeyboardEvent) {
        this.hero.doSearch((event.target as HTMLInputElement).value);
    }

    movePageBy(moveBy: number) {
        this.hero.movePageBy(moveBy);
    }
}
