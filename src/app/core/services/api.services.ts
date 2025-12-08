import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AppMeta {
  appName?: string;
  version?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class MetaService {
  private metaUrl = '/meta.json';

  constructor(private http: HttpClient) {}

  loadMeta(): Observable<AppMeta> {
    return this.http.get<AppMeta>(this.metaUrl).pipe(
      catchError(err => {
        console.warn('⚠️ Impossible de charger meta.json, fallback utilisé', err);
        // Retourne un objet par défaut pour éviter que l'app plante
        return of({ appName: 'OneDay', version: '0.0.0' });
      })
    );
  }
}