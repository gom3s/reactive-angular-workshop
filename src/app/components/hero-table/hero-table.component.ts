import { Component, OnInit } from '@angular/core';
import { DEFAULT_PAGE, Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent implements OnInit {
    heroes$ = this.hero.heroes$;
    page$ = this.hero.userPage$;
    totalResults$ = this.hero.totalResults$;
    totalPages$ = this.hero.totalPages$;
    limit$ = this.hero.limitBS;

    constructor(public hero: HeroService) {}

    ngOnInit() {}

    setLimit(limit) {
        this.hero.limitBS.next(limit);
        this.hero.pageBS.next(DEFAULT_PAGE);
    }

    doSearch(event: KeyboardEvent) {
        this.hero.searchBS.next((event.target as HTMLInputElement).value);
        this.hero.pageBS.next(0);
    }

    movePageBy(moveBy: number) {
        const currentPage = this.hero.pageBS.getValue();
        this.hero.pageBS.next(currentPage + moveBy);
    }
}
