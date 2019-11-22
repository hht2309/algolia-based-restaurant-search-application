/**
 * This class contains the logics for search result
 */
export class SearchResult {
    numHits: number; 
    processingTime: number;
    restaurantHits: object[]; 
    totalPages: number;
    currentPage: number; 
    isLoadMore: boolean; 
    showLoadMoreButton:boolean;

    constructor() {
        this.restaurantHits = []; 
        this.currentPage = 0; 
        this.isLoadMore = false; 
        this.showLoadMoreButton = true;
    }

    resetParems() {
        this.isLoadMore = false; 
        this.currentPage = 0; 
    }

    changeLoadMoreStatus(flag: boolean) {
        this.isLoadMore = flag; 
    }

    update(content:any) {
        this.currentPage++; 
        if (!this.isLoadMore) {
            this.numHits = content.nbHits; 
            this.processingTime = content.processingTimeMS/1000;
            this.restaurantHits = content.hits;
            this.totalPages = content.nbPages;
        } else {
            this.restaurantHits = this.restaurantHits.concat(content.hits);
        }
        this.showLoadMoreButton = (this.currentPage<this.totalPages)?true:false;
    }


}