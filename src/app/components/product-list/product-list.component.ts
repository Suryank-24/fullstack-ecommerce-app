import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule,  NgbPaginationModule ],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  product: Product[] = [];
  currentCategoryId: number = 1;
  previousCateogryId: number = 1;
  searchMode: boolean = false;

thePageNumber: number = 1;
thePageSize: number = 10;
theTotalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute){}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
  });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProduct();
    }
    this.handleListProduct();
  }

  handleSearchProducts(){
    const theKeyword : String = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.product = data;
      }
    ); 
  }

  handleListProduct(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId = 1;
    }

    if(this.previousCateogryId!= this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCateogryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPagination(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(
                                                  data => {
                                                this.product = data._embedded.products;
                                                this.thePageNumber = data.page.number + 1;
                                                this.thePageSize = data.page.size;
                                                this.theTotalElements = data.page.totalElements;
                                                }
                                              )
  }

  onPageChange(newPage: number) {
    this.thePageNumber = newPage;
    // Add logic to fetch new data based on page change
  }
}
