import {
  AfterContentInit, Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID,
  Renderer2
} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Directive({
  selector: '[appImageLoader]'
})
export class ImageLoaderDirective implements AfterContentInit, OnDestroy{
  private nativeElement: HTMLElement;
  private preloader: HTMLElement; 
  private imageContainer: HTMLElement; 

  @Input() imgURL: string = "";
  @Output() emitOnError: EventEmitter<any> = new EventEmitter(); 

  constructor(@Inject(PLATFORM_ID) private platformId: object, 
              private el: ElementRef,
              private renderer: Renderer2) { }

  ngAfterContentInit() {
    this.nativeElement = this.el.nativeElement;
    this.preloader = this.nativeElement.querySelector('.lds-ring');
    this.imageContainer = this.nativeElement.querySelector('.thumbnail'); 
    this.renderer.addClass(this.preloader, "active");
    this.loadImage(); 
  }

  loadImage() {
    let image = new Image(); 
    image.src = this.imgURL; 
    image.onload = () => {
      this.renderer.removeClass(this.preloader,"active");
      this.renderer.addClass(this.imageContainer,"active"); 
    }
  }

  ngOnDestroy() {

  }

}
