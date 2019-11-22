import {
  AfterContentInit, Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID,
  Renderer2
} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Directive({
  selector: '[appHitTimelinePreloader]'
})
export class HitTimelinePreloaderDirective implements AfterContentInit, OnDestroy{

  private nativeElement: HTMLElement; 
  private timeLineContainer: HTMLElement; 
  private hitContainer: HTMLElement; 

  @Input() imgURL: string = ""; 
  @Output() emitOnError: EventEmitter<any> = new EventEmitter(); 

  constructor(@Inject(PLATFORM_ID) private platformId: object, 
  private el: ElementRef,
  private renderer: Renderer2) { }

  ngAfterContentInit() {
    this.nativeElement = this.el.nativeElement; 
    this.timeLineContainer = this.nativeElement.querySelector("app-timeline-preloader"); 
    this.hitContainer = this.nativeElement.querySelector(".restaurant-hit"); 
    this.loadImage(); 
  }

  loadImage() {
    let image = new Image(); 
    image.src = this.imgURL; 
    image.onload = () => {
      setTimeout(function(){
        this.timeLineContainer.style.display = "none"; 
        this.hitContainer.style.display = "flex"; 
      }.bind(this),500); 
    }
  }

  ngOnDestroy(){}

}
