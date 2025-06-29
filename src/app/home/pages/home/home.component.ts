import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from '../../interfaces/projectDTO.interface';
import { PageDTO } from '../../interfaces/pageDTO.interface';

import { SwalService } from '../../../shared/services/swal.service';
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent
  ],
  templateUrl: './home.component.html'
})
export default class HomeComponent implements OnInit {

  public readonly projectService = inject(ProjectService);
  public readonly swalService = inject(SwalService);

  public isLoading: boolean = true;
  public page: number = 0;
  public projects: PageDTO<ProjectDTO> = {} as PageDTO<ProjectDTO>; 

  ngOnInit(): void {
    this.loadProjects(this.page);
  }

  public loadProjects(page: number): void {
    this.page += page;
    this.isLoading = true;
    this.projectService.getProjects(this.page, 12).subscribe({
      next: (response) => {
        this.projects = response;
      },
      error: () => {
        this.swalService.showErrorToast('Error al cargar los proyectos');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public createProject(): void {
    this.swalService.showNameDescriptionForm('Crear Proyecto', 'Crear', 'Nombre del proyecto', 'Descripción del proyecto')?.then(data => {
      if (!data) {
        return;
      }
      this.swalService.showLoadingPopup('Creando proyecto...');
      const request: ProjectDTO = {
        project_name: data.name,
        project_description: data.description
      }
      this.projectService.createProject(request).subscribe({
        next: () => {
          Swal.close();
          this.loadProjects(0);
          this.swalService.showSuccessToast('Proyecto creado exitosamente');
        },
        error: () => {
          Swal.close();
          this.swalService.showErrorToast('Error al crear el proyecto');
        }
      });
    });
  }

}
