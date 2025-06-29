import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';

@Component({
  selector: 'app-hamburguer-menu',
  standalone: true,
  imports: [],
  templateUrl: './hamburguer.component.html'
})
export class HamburguerComponent {

  private readonly elementRef = inject(ElementRef);

  @Input({ required: true }) 
  public eventList: { label: string, labor: () => void }[] = [];

  public menuOpen = false;

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }

}
