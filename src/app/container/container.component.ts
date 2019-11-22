import { Component, OnInit, ViewChild } from '@angular/core';
import { RestaurantSearchService } from '../restaurant-search.service'; 
import { SearchResult } from '../pageelements/result';
import { FacetCuisine } from '../pageelements/facet-cuisine';
import { fromEvent} from 'rxjs';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @ViewChild('resultLists',{static: false}) resultLists; 
  @ViewChild('facetCuisineLoadingOverlay',{static:false}) facetCuisineLoadingOverlay;  
  @ViewChild('facetCuisineContent',{static:false}) facetCuisineContent; 
  @ViewChild('noResultFound',{static:false}) noResultFound; 
  @ViewChild('toTopButton',{static:false}) toTopButton;
  viewInit: boolean; 
  searchStr: string; 
  currentSearch: any;
  objectKeys: any; 
  Math: any;
  Arr: any;
  result: any; 
  facetCuisine: any; 
  observerScrollResult: any; 
  subscriberScrollResult: any; 
  constructor(private restaurantSearchService: RestaurantSearchService) {
    this.searchStr = ""; 
    this.Math = Math; 
    this.Arr = Array; 
    this.objectKeys = Object.keys; 
    this.viewInit = false; 
    this.result = new SearchResult(); 
    this.facetCuisine = new FacetCuisine(); 
  }

  ngOnInit() {
    this.search(); 
  }

  ngAfterViewInit() {
    
  }

  suggestionSearch(term:string) {
    this.searchStr = term; 
    this.search(); 
  }

  search() {
    this.result.resetParems(); 
    this.facetCuisine.changeUpdateStatus(true); 
    // get algolia search helper
    this.currentSearch = this.restaurantSearchService.getHelper(); 
    // toggle refinement
    if  (!this.facetCuisine.isFacetCuisineActive) {
      this.facetCuisine.facetCuisineToDisplay = {}; 
    } else {
      this.currentSearch.toggleFacetRefinement('info.food_type',this.facetCuisine.activeFacetCuisine); 
    }
    // on search callback 
    this.currentSearch.on('search',function(content) {
      if (this.viewInit) {
        this.noResultFound.nativeElement.style.display = "none"; 
      }
      if (this.facetCuisine.updateFacetCuisine&&this.viewInit&&!this.facetCuisine.isFacetCuisineActive) {
          this.facetCuisineLoadingOverlay.nativeElement.style.zIndex = "1";  
      } 
    }.bind(this)); 

    // on result callback
    this.currentSearch.on('result', function(content) {
      if (!this.viewInit) {
        this.viewInit = true; 
        this.observerScrollResult = fromEvent(this.resultLists.nativeElement,'scroll'); 
        this.subscriberScrollResult = this.observerScrollResult.subscribe(function(evt) {
          if (this.resultLists.nativeElement.scrollTop>0) {
            this.toTopButton.nativeElement.style.opacity = 1; 
          } else {
            this.toTopButton.nativeElement.style.opacity = 0; 
          }
        }.bind(this)); 
      }
      this.result.update(content); 
      if (!this.result.isLoadMore) {
        // if search is not load more, update facet
        this.facetCuisine.update(this.result.numHits, content);
        if (this.result.numHits==0) {
          this.noResultFound.nativeElement.style.display = "block";
        } 
      } else {
        setTimeout(function() {
          this.resultLists.nativeElement.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }.bind(this),200); 
      }
      // disable loading overlay
      setTimeout(function() {
        if (this.facetCuisine.updateFacetCuisine && !this.isFacetCuisineActive) {
          this.facetCuisineLoadingOverlay.nativeElement.style.zIndex = "-1";
          this.updateFacetCuisine = false; 
        }
      }.bind(this),500);
    }.bind(this))
    this.currentSearch.setQuery(this.searchStr).setQueryParameter('hitsPerPage',3).setPage(this.result.currentPage).search(); 
  }

  loadMoreResults() {
    this.result.changeLoadMoreStatus(true); 
    this.facetCuisine.changeUpdateStatus(false); 
    this.currentSearch.setPage(this.result.currentPage).search(); 
  }

  refineByCuisine(elRef, facet) {
    let clazz = elRef.getAttribute("class"); 
    this.result.resetParems(); 
    if (clazz.includes("facet-active")) {
      this.facetCuisine.resetParems(); 
      this.facetCuisineContent.nativeElement
      .querySelectorAll(".facet-item")
      .forEach(item => {
        item.setAttribute("class","facet-item enable"); 
      });
      this.currentSearch.clearRefinements('info.food_type').search();
    } else {
      this.facetCuisine.activateFacet(facet); 
      elRef.setAttribute("class","facet-item enable facet-active");
      this.facetCuisineContent.nativeElement
          .querySelectorAll(".facet-item:not(.facet-active)")
          .forEach(item => {
            item.setAttribute("class","facet-item disable"); 
          });
      this.currentSearch.toggleFacetRefinement('info.food_type',this.facetCuisine.activeFacetCuisine).search(); 
    }
  }

  scrollToTop() {
    this.resultLists.nativeElement.firstElementChild.scrollIntoView({ behavior: 'smooth' });
  }
}
