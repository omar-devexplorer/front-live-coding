import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import {
  Subject,
  BehaviorSubject,
  Observable,
  map,
  shareReplay,
  filter,
  tap,
  takeUntil,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService implements OnDestroy {
  private destroy$ = new Subject<void>();

  isScrollTop: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isScrollTop$: Observable<boolean> = this.isScrollTop.asObservable();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  isTablet$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Tablet)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  isWeb$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Web])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.scrollPositionRestoration();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isScrollTop.complete();
  }

  private scrollPositionRestoration(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof Scroll),
        tap(() => this.scrollToElement('scroll-top', 'start')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  scrollToElement(element: string, block?: any): void {
    const targetElement = this.document.getElementById(element);
    if (targetElement && isPlatformBrowser(this.platformId)) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: block || 'end',
        inline: 'nearest',
      });
    }
  }

  changeScrollPosition(isScrollTop: boolean): void {
    this.isScrollTop.next(isScrollTop);
  }
}
