import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComboService {

  constructor(private _http: HttpClient) { }

  getEspecialidades(search?: string): Observable<any> {
    let params = {};
    if(search != null) {
      params['search'] = search;
    }

    return this._http.get<any>(environment.baseUrl + '/especialidades/', {
      params,
    });
  }

  getMedicos(search?: string, especialidades?: Array<any>): Observable<any> {
    let params = {};
    if(search != null) {
      params['search'] = search;
    }

    if(especialidades !== null) {
      params['especialidade'] = especialidades;
    }

    return this._http.get<any>(environment.baseUrl + '/medicos/', {
      params,
    });
  }

  getAgendas(medicos?: Array<any>, especialidades?: Array<any>): Observable<any> {
    let params = {};

    if(medicos !== null) {
      params['medico'] = medicos;
    }

    if(especialidades !== null) {
      params['especialidade'] = especialidades;
    }

    return this._http.get<any>(environment.baseUrl + '/agendas/', {
      params,
    });
  }
}
