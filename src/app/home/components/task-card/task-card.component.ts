import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { TaskDTO } from '../../interfaces/taskDTO.interface';
import { TaskService } from '../../services/task.service';

import { SwalService } from '../../../shared/services/swal.service';
import { HamburguerComponent } from "../hamburguer/hamburguer.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, HamburguerComponent],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent implements OnInit, OnDestroy {

  private readonly taskService = inject(TaskService);
  private readonly swalService = inject(SwalService);

  @Input({ required: true }) public task!: TaskDTO;
  @Input({ required: true }) public projectId: string = '';
  @Output() public updateTaskList = new EventEmitter<TaskDTO>();

  private originalState: boolean = false;
  private debounceTimer: any;

  public hamburguerItems: { label: string, labor: () => void }[] = [
    { label: '✏️ Editar', labor: () => this.editTask() },
    { label: '🗑️ Eliminar', labor: () => this.deleteTask() }
  ];

  ngOnInit(): void {
    this.originalState = this.task.is_completed ?? false;
  }

  public onCheckboxChange(): void {
    clearTimeout(this.debounceTimer);
    this.task.is_completed = !this.task.is_completed;
    if (this.task.is_completed === this.originalState) return;
    this.debounceTimer = setTimeout(() => {
      this.originalState = this.task.is_completed!;
      this.taskService.changeTaskStatus(this.projectId, this.task.id!).subscribe({
        next: () => {
          this.swalService.showSuccessToast('Tarea actualizada');
        },
        error: () => {
          this.swalService.showErrorToast('Error al acutalizar la tarea');
        }
      });
    }, 1000);
  }

  public editTask(): void {
    this.swalService.showNameDescriptionForm(
        'Editar tarea', 
        'Editar', 
        'Nombre de la tarea', 
        'Descripción de la tarea', 
        this.task.task_name, 
        this.task.task_description
      )?.then(data => {
        if (!data) {
          return;
        }
        this.swalService.showLoadingPopup('Editando tarea...');
        const request: TaskDTO = {
          task_name: data.name,
          task_description: data.description
        }
        this.taskService.updateTask(this.projectId, this.task.id!, request).subscribe({
          next: () => {
            Swal.close();
            this.task.task_name = data.name;
            this.task.task_description = data.description;
            this.swalService.showSuccessToast('Tarea actualiza');
          },
          error: () => {
            this.swalService.showErrorToast('Error al actualizar la tarea');
          }
        });
    });
  }

  public deleteTask(): void {
    this.swalService.showConfirmationPopup('¿Estás seguro de eliminar la tarea?', 'Sí, eliminar')
      .then(confirmed => {
        if (!confirmed) return;
        this.swalService.showLoadingPopup('Eliminando tarea...');
        this.taskService.deleteTask(this.projectId, this.task.id!).subscribe({
          next: () => {
            Swal.close();
            this.updateTaskList.emit(this.task);
            this.swalService.showSuccessToast('Tarea eliminada');
          },
          error: () => {
            this.swalService.showErrorToast('Error al eliminar la tarea');
          }
        });
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
  }

}
