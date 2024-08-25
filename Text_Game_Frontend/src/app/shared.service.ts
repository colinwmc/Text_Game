import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private APIUrl = "https://localhost:7125/api";
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application.json',
    }),
  };
  constructor(private http: HttpClient) { }

  getPCList(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/PC', this.httpOptions);
  }

}
