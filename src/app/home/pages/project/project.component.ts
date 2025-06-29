import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { HamburguerComponent } from "../../components/hamburguer/hamburguer.component";
import { PageDTO } from '../../interfaces/pageDTO.interface';
import { TaskDTO } from '../../interfaces/taskDTO.interface';
import { ProjectDTO } from '../../interfaces/projectDTO.interface';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

import { SwalService } from '../../../shared/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TaskCardComponent,
    HamburguerComponent
  ],
  templateUrl: './project.component.html'
})
export default class ProjectComponent implements OnInit {

  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly swalService = inject(SwalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public isLoading: boolean = true;
  public page: number = 0;
  public project!: ProjectDTO;
  public tasks: PageDTO<TaskDTO> = {} as PageDTO<TaskDTO>;

  public hamburguerItems: { label: string, labor: () => void }[] = [
    { label: '✏️ Editar', labor: () => this.editProject() },
    { label: '🗑️ Eliminar', labor: () => this.deleteProject() }
  ];

  public ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId) {
      this.loadProject(projectId);
    }
  }

  private loadProject(projectId: string): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (res: ProjectDTO) => {
        this.project = res;
        this.loadTasks(this.page);
      },
      error: () => {
        this.swalService.showErrorToast('Error al cargar el proyecto');
      }
    });
  }

  public editProject(): void {
    this.swalService.showNameDescriptionForm(
        'Editar Projecto', 
        'Editar', 
        'Nombre del proyecto', 
        'Descripción del proyecto', 
        this.project.project_name, 
        this.project.project_description
      )?.then(data => {
        if (!data) {
          return;
        }
        this.swalService.showLoadingPopup('Editando proyecto...');
        const request: ProjectDTO = {
          project_name: data.name,
          project_description: data.description
        }
        this.projectService.updateProject(this.project.id!, request).subscribe({
          next: () => {
            Swal.close();
            this.loadProject(this.project.id!);
            this.swalService.showSuccessToast('Proyecto actualizado');
          },
          error: () => {
            this.swalService.showErrorToast('Error al actualizar el proyecto');
          }
        });
    });
  }

  public deleteProject(): void {
    this.swalService.showConfirmationPopup('¿Estás seguro de eliminar el proyecto?', 'Sí, eliminar')
      .then(confirmed => {
        if (!confirmed) return;
        this.swalService.showLoadingPopup('Eliminando proyecto...');
        this.projectService.deleteProject(this.project.id!).subscribe({
          next: () => {
            Swal.close();
            this.swalService.showSuccessToast('Proyecto eliminado');
            this.router.navigate(['/']);
          },
          error: () => {
            this.swalService.showErrorToast('Error al eliminar el proyecto');
          }
        });
      });
  }

  public loadTasks(page: number): void {
    this.page += page;
    this.isLoading = true;
    this.taskService.getTasks(this.project.id!, this.page, 100).subscribe({
      next: (response) => {
        this.tasks = response;
      },
      error: () => {
        this.swalService.showErrorToast('Error al cargar las tareas del proyecto');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public createTask(): void {
    this.swalService.showNameDescriptionForm('Crear Tarea', 'Crear', 'Nombre de la tarea', 'Descripción de la tarea')?.then(data => {
      if (!data) {
        return;
      }
      this.swalService.showLoadingPopup('Creando tarea...');
      const request: TaskDTO = {
        task_name: data.name,
        task_description: data.description
      }
      this.taskService.createTask(this.project.id!, request).subscribe({
        next: () => {
          Swal.close();
          this.loadTasks(0);
          this.swalService.showSuccessToast('Tarea creada exitosamente');
        },
        error: () => {
          this.swalService.showErrorToast('Error al crear la tarea');
        }
      });
    });
  }

  public popTask(task: TaskDTO): void {
    this.tasks.content = this.tasks.content.filter(t => t.id !== task.id);
  }

}
