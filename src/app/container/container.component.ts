import { Component, OnInit, ViewChild } from '@angular/core';
import { RestaurantSearchService } from '../restaurant-search.service'; 
import { SearchResult } from '../pageelements/result';


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

  viewInit: boolean; 
  searchStr: string; 
  currentSearch: any;
  objectKeys: any; 
  facetCuisineFromSearch: object; 
  isFacetCuisineActive: boolean; 
  activeFacetCuisine: string; 
  facetCuisineToDisplay: object; 
  facetNameInDescendingOrder: []; 
  facetCuisinePerPage: number; 
  updateFacetCuisine: boolean; 
  showMore: boolean; 
  Math: any;
  Arr: any;
  result: any; 
  constructor(private restaurantSearchService: RestaurantSearchService) {
    this.searchStr = ""; 
    this.Math = Math; 
    this.Arr = Array; 
    this.objectKeys = Object.keys; 
    this.facetCuisineFromSearch = {}; 
    this.isFacetCuisineActive = false;
    this.activeFacetCuisine = ''; 
    this.facetCuisineToDisplay = {}
    this.facetCuisinePerPage = 4; 
    this.updateFacetCuisine = false;
    this.viewInit = false; 
    this.result = new SearchResult(); 
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
    this.updateFacetCuisine = true; 
    // get algolia search helper
    this.currentSearch = this.restaurantSearchService.getHelper(); 
    // toggle refinement
    if  (!this.isFacetCuisineActive) {
      this.facetCuisineToDisplay = {}; 
    } else {
      this.currentSearch.toggleFacetRefinement('info.food_type',this.activeFacetCuisine); 
    }

    // on search callback 
    this.currentSearch.on('search',function(content) {
      if (this.viewInit) {
        this.noResultFound.nativeElement.style.display = "none"; 
      }
      if (this.updateFacetCuisine&&this.viewInit&&!this.isFacetCuisineActive) {
          this.facetCuisineLoadingOverlay.nativeElement.style.zIndex = "1";  
      } 
    }.bind(this)); 

    // Call back when get search result
    this.currentSearch.on('result', function(content) {
      if (!this.viewInit) {
        this.viewInit = true; 
      }
      this.result.updateResult(content); 
      if (!this.result.isLoadMore) {
        if (this.result.numHits>0) {
          this.facetCuisineFromSearch = content.facets[0].data;
          this.facetNameInDescendingOrder = Object.keys(this.facetCuisineFromSearch)
                                                  .sort(function(a,b){return this.facetCuisineFromSearch[b]-this.facetCuisineFromSearch[a]}.bind(this)); 
          // initialize facet cuisine to display                                        
          if (!this.isFacetCuisineActive) {
            if (this.facetNameInDescendingOrder.length > this.facetCuisinePerPage) {
              this.showMore = true; 
              for (var i = 0; i<this.facetCuisinePerPage; i++) {
                let facetName = this.facetNameInDescendingOrder[i]; 
                this.facetCuisineToDisplay[facetName] = this.facetCuisineFromSearch[facetName]; 
              }
            } else {
              this.showMore = false; 
              for (var i = 0; i<this.facetNameInDescendingOrder.length; i++) {
                let facetName = this.facetNameInDescendingOrder[i]; 
                this.facetCuisineToDisplay[facetName] = this.facetCuisineFromSearch[facetName]; 
              }
            }
          } else {
            this.facetCuisineToDisplay[this.activeFacetCuisine] = this.facetCuisineFromSearch[this.activeFacetCuisine]; 
          }
        } else {
          this.showMore = false; 
          this.facetCuisineFromSearch = {}; 
          this.facetNameInDescendingOrder = []; 
          if  (!this.isFacetCuisineActive) {
            this.facetCuisineToDisplay = {}; 
          } else {
            this.facetCuisineToDisplay[this.activeFacetCuisine] = 0; 
          }
          this.noResultFound.nativeElement.style.display = "block"; 
        }
      } else {
        setTimeout(function() {
          this.resultLists.nativeElement.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }.bind(this),200); 
      }

      // disable loading overlay
      setTimeout(function() {
        if (this.updateFacetCuisine && !this.isFacetCuisineActive) {
          this.facetCuisineLoadingOverlay.nativeElement.style.zIndex = "-1";
          this.updateFacetCuisine = false; 
        }
      }.bind(this),500);
    }.bind(this))
    this.currentSearch.setQuery(this.searchStr).setQueryParameter('hitsPerPage',3).setPage(this.result.currentPage).search(); 
  }

  loadMoreResults() {
    this.result.changeLoadMoreStatus(true); 
    this.updateFacetCuisine = false; 
    this.currentSearch.setPage(this.result.currentPage).search(); 
  }

  refineByCuisine(elRef, facet) {
    let clazz = elRef.getAttribute("class"); 
    this.result.resetParems(); 
    if (clazz.includes("facet-active")) {
      this.facetCuisineToDisplay = {};
      this.isFacetCuisineActive = false; 
      this.activeFacetCuisine = ''; 
      this.facetCuisineContent.nativeElement
      .querySelectorAll(".facet-item")
      .forEach(item => {
        item.setAttribute("class","facet-item enable"); 
      });
      this.currentSearch.clearRefinements('info.food_type').search();
    } else {
      this.isFacetCuisineActive = true; 
      this.showMore = true; 
      this.activeFacetCuisine = facet; 
      elRef.setAttribute("class","facet-item enable facet-active");
      this.facetCuisineToDisplay[facet] = this.facetCuisineFromSearch[facet]; 
      this.facetCuisineContent.nativeElement
          .querySelectorAll(".facet-item:not(.facet-active)")
          .forEach(item => {
            item.setAttribute("class","facet-item disable"); 
          });
      this.currentSearch.toggleFacetRefinement('info.food_type',this.activeFacetCuisine).search(); 
    }
  }

  showMoreFacet() {
    let numFacetDisplayed = Object.keys(this.facetCuisineToDisplay).length; 
    let numAllFacets = this.facetNameInDescendingOrder.length; 
    if ((numFacetDisplayed+this.facetCuisinePerPage)<numAllFacets) {
      for (var i = numFacetDisplayed; i<(numFacetDisplayed+this.facetCuisinePerPage); i++) {
        let facetName = this.facetNameInDescendingOrder[i]; 
        this.facetCuisineToDisplay[facetName] = this.facetCuisineFromSearch[facetName]; 
      }
    } else {
      this.showMore = false; 
      for (var i = numFacetDisplayed; i<numAllFacets; i++) {
        let facetName = this.facetNameInDescendingOrder[i]; 
        this.facetCuisineToDisplay[facetName] = this.facetCuisineFromSearch[facetName]; 
      }
    }
  }
}
