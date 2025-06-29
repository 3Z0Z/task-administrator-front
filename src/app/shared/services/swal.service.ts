import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  public customSwal = Swal.mixin({
    iconColor: '#FFF',
    customClass: {
      popup: 'w-full max-w-md glass-effect p-6 rounded-xl shadow-lg',
      title: 'text-2xl font-bold text-gray-900',
      htmlContainer: 'text-gray-600',
      actions: 'flex flex-col md:flex-row gap-6 justify-center mt-4 w-full px-[30px]',
      confirmButton: 'white-button text-lg font-semibold sm:w-full md:flex-1 py-2 rounded outline-none',
      cancelButton: 'bg-gray-300 hover:bg-gray-400 text-lg text-gray-700 font-semibold sm:w-full md:flex-1 py-2 rounded outline-none',
      closeButton: 'text-white hover:text-gray-300',
    },
    backdrop: '',
    buttonsStyling: false,
    reverseButtons: true
  });

  public customToast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'glass-effect shadow-lg rounded-xl p-4 flex items-center',
      title: 'text-gray-800 font-semibold ml-2',
    },
  });

  public showSuccessPopup(title: string, message: string): void {
    this.customSwal.fire({
      icon: 'success',
      title,
      html: `<p>${message}</p>`,
      showCancelButton: false
    });
  }

  public showErrorPopup(message?: string): void {
    const errorMessage = message != undefined || message != null ? message : 'Servicio no disponible, por favor, intenta más tarde.';
    this.customSwal.fire({
      icon: 'error',
      title: 'Hubo un error',
      html: `<p>${errorMessage}</p>`,
      showCancelButton: false,
      focusConfirm: true
    });
  }

  public showSuccessToast(title: string): void {
    this.customToast.fire({
      iconColor: '#22c55e',
      icon: 'success',
      title,
    });
  }

  public showErrorToast(title: string): void {
    this.customToast.fire({
      iconColor: '#ef4444',
      icon: 'error',
      title,
    });
  }

  public showLoadingPopup(message: string): void {
    this.customSwal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      html: `
        <div class="flex justify-center items-center h-full">
          <img 
            src="assets/svg/loader.svg" 
            alt="loader"
            class="w-16 h-16"
          />
        </div>
      `
    })
  }

  public showNameDescriptionForm(
    title: string, 
    buttonMessage: string, 
    namePlaceholder: string, 
    descriptionPlaceholder: string,
    nameValue?: string,
    descriptionValue?: string
  ): Promise<{ name: string; description: string }> | undefined {
    return this.customSwal.fire({
      title,
      showCloseButton: true,
      allowEscapeKey: true,
      allowOutsideClick: true,
      html: `
        <form autocomplete="off" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2 items-start">
            <label for="name" class="text-md text-black font-bold">Nombre:</label>
            <input
              id="name" 
              type="text" 
              class="input-glass"
              placeholder="${namePlaceholder}"
              maxlength="30"
            >
          </div>
          <div class="flex flex-col gap-2 items-start">
            <label for="description" class="text-md text-black font-bold">Descripción:</label>
            <textarea
              id="description"
              type="text" 
              class="input-glass"
              placeholder="${descriptionPlaceholder}"
              maxlength="100"
            ></textarea>
          </div>
        </form>
      `,
      confirmButtonText: buttonMessage,
      showCancelButton: true,
      didOpen: () => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('description') as HTMLTextAreaElement;
        if (nameInput) nameInput.value = nameValue ?? '';
        if (descriptionTextarea) descriptionTextarea.value = descriptionValue ?? '';
      },
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLTextAreaElement).value.trim();
        if (!name || !description) {
          return Swal.showValidationMessage('Por favor, completa todos los campos.');
        }
        if (/^[a-zA-Z0-9 ]{1,30}$/.test(name) === false) {
          return Swal.showValidationMessage('El nombre del proyecto debe tener entre 1 y 30 caracteres alfanuméricos.');
        }
        if (/^[a-zA-Z0-9,-. ]{10,100}$/.test(description) === false) {
          return Swal.showValidationMessage('La descripción del proyecto debe tener entre 10 y 100 caracteres alfanuméricos.');
        }
        return { name, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        return result.value;
      }
      return undefined;
    });
  }

  public showConfirmationPopup(title: string, confirmButtonText: string): Promise<boolean> {
  return this.customSwal.fire({
    title,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    return result.isConfirmed;
  });
}

}
