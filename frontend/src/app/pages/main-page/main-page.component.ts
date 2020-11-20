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

    if(this.comboEspecialidadesData.length > 0) {
      this.comboEspecialidadesSearchDebounce = setTimeout(() => {
        this.loadMedicos();
      }, 200);
    }

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

  comboAgendasLoading: Boolean = false;
  comboAgendasData: Array<any> = [];
  agendaSelecionado: any;

  private loadAgendas(): void {
    if(this.medicoSelecionado == null) return;
    if(this.especialidadesSelecionadas.length == 0) return;

    this.comboAgendasLoading = true;
    this.comboService.getAgendas([this.medicoSelecionado], this.especialidadesSelecionadas)
      .pipe(take(1))
      .subscribe((response) => {
        this.comboAgendasLoading = false;
        this.comboAgendasData = response;
      });
  }

  comboHorariosData: Array<any> = [];
  horarioSelecionado: any;

  public loadHorarios(): void {
    if(this.agendaSelecionado == null) {
      this.comboHorariosData = [];
      return;
    };

    let horarios = [];
    this.comboAgendasData.map((item) => {
      if(item.id == this.agendaSelecionado) {
        for (let i = 0; i < item.horarios.length; i++) {
          horarios.push(item.horarios[i]);
        }
      }
    });

    this.comboHorariosData = horarios;
  }

  public handleEspecialidadesOnChange = () => {
    if(this.especialidadesSelecionadas.length === 0) {
      this.comboMedicosData = [];
      this.medicoSelecionado = null;

      this.comboAgendasData = [];
      this.agendaSelecionado = null;

      this.comboHorariosData = [];
      this.horarioSelecionado = null;
    }
  }

  public handleMedicoOnChange = () => {
    if(this.medicoSelecionado == null) {
      this.comboAgendasData = [];
      this.agendaSelecionado = null;

      this.comboHorariosData = [];
      this.horarioSelecionado = null;
    } else {
      this.loadAgendas();
    }
  }

  public handleAgendasOnChange = () => {
    if(this.agendaSelecionado == null) {
      this.comboHorariosData = [];
      this.horarioSelecionado = null;
    } else {
      this.loadHorarios();
    }
  }

  handleOpenModal() {
    this.loadEspecialidades();
    this.modalOpened = true;
  }

  handleClearModalData() {
    this.comboEspecialidadesData = [];
    this.especialidadesSelecionadas = [];

    this.comboMedicosData = [];
    this.medicoSelecionado = null;

    this.comboAgendasData = [];
    this.agendaSelecionado = null;

    this.comboHorariosData = [];
    this.horarioSelecionado = null;
  }

  handleCancelModal() {
    this.handleClearModalData();
    this.modalOpened = false;
  }

  handleSaveModal() {
    console.log('Marque uma consulta na agenda do ID', this.agendaSelecionado, 'no Horario', this.horarioSelecionado)
    this.modalOpened = false;
    this.handleClearModalData();
  }

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private comboService: ComboService,
    private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.userName = user.name;
    this.appointmentService.getConsultas()
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
