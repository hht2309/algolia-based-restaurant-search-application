/**
 * This class contains the logics for cuisine facet
 */

 export class FacetCuisine {
    facetCuisineFromSearch: object; 
    isFacetCuisineActive: boolean; 
    activeFacetCuisine: string; 
    facetCuisineToDisplay: object; 
    facetNameInDescendingOrder: any; 
    facetCuisinePerPage: number; 
    updateFacetCuisine: boolean; 
    showMore: boolean; 

    constructor() {
        this.facetCuisineFromSearch = {}; 
        this.isFacetCuisineActive = false;
        this.activeFacetCuisine = ''; 
        this.facetCuisineToDisplay = {}
        this.facetCuisinePerPage = 4; 
        this.updateFacetCuisine = false;
    }

    resetParems() {
        this.facetCuisineToDisplay = {}; 
        this.isFacetCuisineActive = false; 
        this.activeFacetCuisine = ''; 
    }

    update(numHits: number, content: any) {
        if (numHits>0) {
            this.facetCuisineFromSearch = content.facets[0].data;
            this.facetNameInDescendingOrder = Object.keys(this.facetCuisineFromSearch)
                                                    .sort(function(a,b) {
                                                        return this.facetCuisineFromSearch[b] - this.facetCuisineFromSearch[a]
            }.bind(this)); 
            // initialize facet cuisine to display
            if (!this.isFacetCuisineActive) {
                this.facetCuisineToDisplay = {}; 
                let bound: number; 
                if (this.facetNameInDescendingOrder.length>this.facetCuisinePerPage) {
                    this.showMore = true; 
                    bound = this.facetCuisinePerPage; 
                } else {
                    this.showMore = false; 
                    bound = this.facetNameInDescendingOrder.length; 
                }
                for(var i=0; i<bound; i++) {
                    let facetName = this.facetNameInDescendingOrder[i]; 
                    this.facetCuisineToDisplay[facetName] = this.facetCuisineFromSearch[facetName]; 
                }
            } else {
                this.facetCuisineToDisplay[this.activeFacetCuisine] = this.facetCuisineFromSearch[this.activeFacetCuisine]; 
            }
        } else {
            this.facetCuisineFromSearch = {}; 
            this.facetNameInDescendingOrder = []; 
            if (!this.isFacetCuisineActive) {
                this.facetCuisineToDisplay = {}; 
                this.showMore = false; 
            } else {
                this.facetCuisineToDisplay[this.activeFacetCuisine] = 0;
            }
        } 
    }

    changeUpdateStatus(isUpdate: boolean) {
        this.updateFacetCuisine = isUpdate; 
    }

    activateFacet(facet: string) {
        this.isFacetCuisineActive = true; 
        this.activeFacetCuisine = facet; 
    }

    isFacetActive() {
        return this.isFacetCuisineActive; 
    }

    getFacetType() {
        return 'info.food_type'; 
    }

    getActiveFacet() {
        return this.activeFacetCuisine; 
    }

    showMoreFacet() {
        let numFacetDisplayed = Object.keys(this.facetCuisineToDisplay).length; 
        let numAllFacet = this.facetNameInDescendingOrder.length; 
        let bound: number; 
        if ((numFacetDisplayed+this.facetCuisinePerPage)<numAllFacet) {
            bound = numFacetDisplayed+this.facetCuisinePerPage; 
        } else {
            this.showMore = false; 
            bound = numAllFacet; 
        }
        for (var i = numFacetDisplayed; i<bound; i++) {
            let facetName = this.facetNameInDescendingOrder[i]; 
            this.facetCuisineToDisplay[facetName] = this.facetCuisineFromSearch[facetName]; 
        }
    }
 }