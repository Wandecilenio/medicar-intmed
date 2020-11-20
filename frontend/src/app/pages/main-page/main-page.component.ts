import { Component, OnInit } from '@angular/core';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ComboService } from 'src/app/services/combo.service';
import { take } from 'rxjs/operators';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'medicar-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  userName = null;

  consultas: Array<any> = [];

  // Icons
  iconCross = faTimes;
  iconAdd = faPlus;

  // Modal new appointment
  modalOpened: Boolean = false;
  modalSaveDisabled: Boolean = true;

  comboEspecialidadesSearchDebounce: any;
  comboEspecialidadesSearch: string = null;
  comboEspecialidadesLoading: Boolean = false;
  comboEspecialidadesData: Array<any> = [];
  especialidadesSelecionadas: Array<any> = [];

  private loadEspecialidades(): void {
    this.comboEspecialidadesLoading = true;
    this.comboService.getEspecialidades(this.comboEspecialidadesSearch)
      .pipe(take(1))
      .subscribe((response) => {
        this.comboEspecialidadesLoading = false;
        this.comboEspecialidadesData = response;
      });
  }

  public handleSetEspecialidadesSearch = (term: string, item: any) => {
    this.comboEspecialidadesSearch = term;
    return true;
  }

  public handleEspecialidadesSearch = () => {
    if(this.comboEspecialidadesSearchDebounce) {
      clearTimeout(this.comboEspecialidadesSearchDebounce);
    }

    this.comboEspecialidadesSearchDebounce = setTimeout(() => {
      this.loadEspecialidades();
    }, 500);

    return true;
  }

  public handleEspecialidadeOnAdd = () => {
    if(this.comboEspecialidadesSearchDebounce) {
      clearTimeout(this.comboEspecialidadesSearchDebounce);
    }

    this.comboEspecialidadesSearchDebounce = setTimeout(() => {
      this.loadMedicos();
    }, 200);

    return true;
  }

  public handleEspecialidadeOnRemove = () => {
    if(this.comboEspecialidadesSearchDebounce) {
      clearTimeout(this.comboEspecialidadesSearchDebounce);
    }

    this.comboEspecialidadesSearchDebounce = setTimeout(() => {
      this.loadMedicos();
    }, 200);

    return true;
  }

  comboMedicosSearchDebounce: any;
  comboMedicosSearch: string = null;
  comboMedicosLoading: Boolean = false;
  comboMedicosData: Array<any> = [];
  medicoSelecionado: any;

  private loadMedicos(): void {
    this.comboMedicosLoading = true;
    this.comboService.getMedicos(this.comboMedicosSearch, this.especialidadesSelecionadas)
      .pipe(take(1))
      .subscribe((response) => {
        this.comboMedicosLoading = false;
        this.comboMedicosData = response;
      });
  }

  public handleSetMedicosSearch = (term: string, item: any) => {
    this.comboMedicosSearch = term;
    return true;
  }

  public handleMedicosSearch = () => {
    if(this.comboMedicosSearchDebounce) {
      clearTimeout(this.comboMedicosSearchDebounce);
    }

    this.comboMedicosSearchDebounce = setTimeout(() => {
      this.loadMedicos();
    }, 500);

    return true;
  }

  handleOpenModal() {
    this.loadEspecialidades();
    this.modalOpened = true;
  }

  handleClearModalData() {
    this.comboEspecialidadesData = [];
    this.comboMedicosData = [];
  }

  handleCancelModal() {
    this.handleClearModalData();
    this.modalOpened = false;
  }

  handleSaveModal() {
    this.modalOpened = false;
    alert('Saved');
  }

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private comboService: ComboService,
    private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.userName = user.name;
    this.appointmentService.getAll()
      .pipe(take(1))
      .subscribe((response) => {
        this.consultas = response;
      });
  }

  handleLogout() {
    this.authService.doLogout();
    this.toastrService.success('Autenticação', 'Deslogado com sucesso!');
  }
}
