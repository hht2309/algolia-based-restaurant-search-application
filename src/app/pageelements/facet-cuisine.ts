/**
 * This class contains the logics for cuisine facet
 */

 export class FacetCuisine {
    facetCuisineFromSearch: object; 
    isFacetCuisineActive: boolean; 
    activeFacetCuisine: string; 
    facetCuisineToDisplay: object; 
    facetNameInDescendingOrder: []; 
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
 }