import { Key } from 'protractor';

/**
 * This class contains the logics for rating facet
 */

 export class FacetRating {
     isFacetRatingActive: boolean; 
     activeFacetRating: number; 
     facetRatingToDisplay: object; 
     updateFacetRating: boolean; 
     temp: object; 
     constructor() {
         this.isFacetRatingActive = false; 
         this.activeFacetRating = -1; 
         this.updateFacetRating = false; 
         this.resetFacetToDisplay(); 
     }

     resetParems() {
         this.isFacetRatingActive = false; 
         this.activeFacetRating = -1; 
         this.updateFacetRating = false; 
         this.resetFacetToDisplay(); 
     }

     update(content: any) {
        if (content.nbHits>0) {
            this.temp = content.facets[1].data; 
            if (!this.isFacetRatingActive) {
                this.resetFacetToDisplay(); 
                Object.keys(this.temp).forEach(function(key) {
                    this.facetRatingToDisplay[key] = this.temp[key]; 
                }.bind(this));
            } else {
                this.facetRatingToDisplay[this.activeFacetRating] = this.temp[this.activeFacetRating]; 
            }
        } else {
            this.resetFacetToDisplay(); 
        }
     }

     activateFacet(facet: number) {
         this.isFacetRatingActive = true; 
         this.activeFacetRating = facet; 
     }

     isFacetActive() {
         return this.isFacetRatingActive; 
     }

     getFacetType() {
         return 'info.stars_group'; 
     }

     getActiveFacet() {
         return this.activeFacetRating; 
     }

     resetFacetToDisplay() {
         this.facetRatingToDisplay = {
             1: 0, 
             2: 0, 
             3: 0, 
             4: 0, 
             5: 0
         }
     }
 }