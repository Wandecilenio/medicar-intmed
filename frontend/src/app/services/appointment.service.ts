import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private _http: HttpClient) { }

  getConsultas(): Observable<any>{
    return this._http.get<any>(environment.baseUrl + '/consultas/');
  }

  marcarConsulta(agenda_id: Number, horario: string): Observable<any>{
    return this._http.post<any>(environment.baseUrl + '/consultas/', {
      agenda_id,
      horario
    });
  }

  desmarcarConsulta(consulta_id: Number): Observable<any>{
    return this._http.delete<any>(environment.baseUrl + '/consultas/' + consulta_id + '/');
  }
}
