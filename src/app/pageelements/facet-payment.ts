/**
 * This class contains the logics for payment option facet
 */

 export class FacetPaymentOption {
     isFacetPaymentActive: boolean; 
     activeFacetPayment: string; 
     facetPaymentToDisplay: object; 
     temp: object; 
     elRef: any; 
     constructor() {
         this.isFacetPaymentActive = false; 
         this.activeFacetPayment = ''; 
         this.resetFacetToDisplay(); 
         this.elRef = null; 
     }

     resetParems() {
         this.isFacetPaymentActive = false; 
         this.activeFacetPayment =''; 
         this.elRef.classList.remove("facet-active");
         this.elRef = null; 
         this.resetFacetToDisplay(); 
     }

     update(content: any) {
        if (content.nbHits>0) {
            this.temp = content.facets[2].data; 
            if (!this.isFacetPaymentActive) {
                this.resetFacetToDisplay(); 
                Object.keys(this.facetPaymentToDisplay).forEach(function(key) {
                    this.facetPaymentToDisplay[key] = this.temp[key]; 
                }.bind(this));
            } else {
                this.facetPaymentToDisplay[this.activeFacetPayment] = this.temp[this.activeFacetPayment];
            }
        } else {
            this.resetFacetToDisplay(); 
        }
     }

     activateFacet(facet: string, elRef: any) {
         this.isFacetPaymentActive = true; 
         this.activeFacetPayment = facet; 
         this.elRef = elRef; 
     }

     isFacetActive() {
         return this.isFacetPaymentActive; 
     }

     getFacetType() {
         return 'payment_options'; 
     }

     getFacetCommonName() {
        return 'Payment options'; 
    }

     getActiveFacet() {
         return this.activeFacetPayment; 
     }

     getElRef() {
         return this.elRef; 
     }

     resetFacetToDisplay() {
         this.facetPaymentToDisplay = {
             'AMEX': 0,
             'Discover': 0,
             'MasterCard': 0,
             'Visa': 0
         }
     }
 }