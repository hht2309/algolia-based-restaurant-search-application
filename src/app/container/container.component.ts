import { Component, OnInit, ViewChild } from '@angular/core';
import { RestaurantSearchService } from '../restaurant-search.service'; 
import { SearchResult } from '../pageelements/result';
import { FacetCuisine } from '../pageelements/facet-cuisine';
import { fromEvent} from 'rxjs';
import { FacetRating } from '../pageelements/facet-rating';
import { FacetPaymentOption } from '../pageelements/facet-payment';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @ViewChild('resultLists',{static: false}) resultLists; 
  @ViewChild('facetCuisineLoadingOverlay',{static:false}) facetCuisineLoadingOverlay;  
  @ViewChild('noResultFound',{static:false}) noResultFound; 
  @ViewChild('toTopButton',{static:false}) toTopButton;
  @ViewChild('facetCuisineContent',{static:false}) facetCuisineContent; 
  @ViewChild('facetRatingContent',{static:false}) facetRatingContent; 
  @ViewChild('facetPaymentContent',{static:false}) facetPaymentContent; 
  
  viewInit: boolean; 
  searchStr: string; 
  currentSearch: any;
  objectKeys: any; 
  Math: any;
  Arr: any;
  result: any; 
  facetCuisine: any; 
  facetRating: any; 
  facetPayment: any; 
  facetList: any; 
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
    this.facetRating = new FacetRating(); 
    this.facetPayment = new FacetPaymentOption(); 
    this.facetList = [this.facetCuisine, this.facetRating, this.facetPayment]; 
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
    this.facetList.forEach(function(facet) {
      if (facet.isFacetActive()) {
        this.currentSearch.toggleFacetRefinement(facet.getFacetType(),facet.getActiveFacet()); 
      }
    }.bind(this))
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
        this.facetRating.update(content); 
        this.facetPayment.update(content); 
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
          this.facetCuisine.changeUpdateStatus(false); 
        }
      }.bind(this),400);
    }.bind(this))
    this.currentSearch.setQuery(this.searchStr).setQueryParameter('hitsPerPage',3).setPage(this.result.currentPage).search(); 
  }

  loadMoreResults() {
    this.result.changeLoadMoreStatus(true); 
    this.facetCuisine.changeUpdateStatus(false); 
    this.currentSearch.setPage(this.result.currentPage).search(); 
  }

  refine(elRef, facetType, facet) {
    let clazz = elRef.getAttribute("class"); 
    this.result.resetParems(); 
    if (clazz.includes("facet-active")) {
      this.getFacetInstance(facetType).resetParems();
      this.getFacetDOMContainer(facetType).querySelectorAll(".facet-item:not(.zero-hits)")
      .forEach(item => {
        item.setAttribute("class","facet-item enable"); 
      });
      this.currentSearch.clearRefinements(facetType).search();
    } else {
      this.getFacetInstance(facetType).activateFacet(facet,elRef); 
      elRef.setAttribute("class","facet-item enable facet-active");
      this.getFacetDOMContainer(facetType).querySelectorAll(".facet-item:not(.facet-active):not(.zero-hits)")
          .forEach(item => {
            item.setAttribute("class","facet-item disable"); 
          });
      this.currentSearch.toggleFacetRefinement(facetType,facet).search(); 
    }

  }

  getFacetInstance(type: string) {
    switch (type) {
      case 'info.food_type': {
        return this.facetCuisine; 
      }
      case 'info.stars_group': {
        return this.facetRating; 
      }
      case 'payment_options': {
        return this.facetPayment;
      }
    }
  }

  getFacetDOMContainer(type: string) {
    switch (type) {
      case 'info.food_type': {
        return this.facetCuisineContent.nativeElement; 
      }
      case 'info.stars_group': {
        return this.facetRatingContent.nativeElement; 
      }
      case 'payment_options': {
        return this.facetPaymentContent.nativeElement;
      }
    }
  }

  clearAllFilter() {
    this.result.resetParems(); 
    this.facetList.forEach(function(facet) {
      if (facet.isFacetActive()) {
        facet.resetParems();
      }
    }.bind(this));
    this.facetCuisine.changeUpdateStatus(true); 
    this.facetList.forEach(function(facet) {
      this.currentSearch.clearRefinements(facet.getFacetType()); 
    }.bind(this)); 
    this.search();
  }

  isThereFacetActive() {
    let ans = false; 
    this.facetList.forEach(function(facet) {
        ans = ans || facet.isFacetActive(); 
    }.bind(this)); 
    return ans; 
  }

  scrollToTop() {
    this.resultLists.nativeElement.firstElementChild.scrollIntoView({ behavior: 'smooth' });
  }
}
