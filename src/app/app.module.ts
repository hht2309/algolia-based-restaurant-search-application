import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { ContainerComponent } from './container/container.component';
import { RestaurantSearchService} from './restaurant-search.service';
import { ImageLoaderDirective } from './image-loader.directive';
import { TimelinePreloaderComponent } from './timeline-preloader/timeline-preloader.component';
import { HitTimelinePreloaderDirective } from './hit-timeline-preloader.directive';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    ImageLoaderDirective,
    TimelinePreloaderComponent,
    HitTimelinePreloaderDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [RestaurantSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
