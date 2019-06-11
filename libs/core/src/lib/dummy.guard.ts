import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DummyGuard implements CanLoad {
  constructor() {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
