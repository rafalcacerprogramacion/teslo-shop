import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@authinterfaces/user.interfaces';
import { AuthService } from '@authservices/auth.service';
import { Gender, Product, ProductsResponse } from '@producs/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

interface Options{
  limit?: number,
  offset?: number,
  gender?: string,
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();
  private authService = inject(AuthService);

  getProducts(options: Options): Observable<ProductsResponse>{
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    
    if( this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`,
      {
        params: {
          limit,
          offset,
          gender,
        }
      }
    )
    .pipe( 
      tap( (resp) => console.log(resp)),
      tap( (resp) => this.productsCache.set(key, resp)),
    ); 
  }

  getProductByIdSlug( slugProduct: string ): Observable<Product>{
    if( this.productCache.has(slugProduct)){
      return of(this.productCache.get(slugProduct)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${slugProduct}`)
    .pipe(
      tap( (product) => this.productCache.set(slugProduct, product))
    ); 
  }

  getProductById( id: string ): Observable<Product>{

    if( id == 'new' ) return of(emptyProduct);

    if( this.productCache.has(id)){
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap( (product) => this.productCache.set(id, product))
    ); 
  }

  getImage(image: string){
    return this.http.get<ProductsResponse>(`${baseUrl}/files/product/${image}`)
    .pipe(
      tap( (resp) => console.log(resp))
    ); 
  }

  createProduct( productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
       return this.http.post<Product>(`${ baseUrl }/products`, productLike)
    .pipe(
      tap((product) => this.updateProductCache(product)),
    );
  }

  updateProduct( id:string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
      
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList)
    .pipe(
      map( imageNames => ({
        ...productLike,
        images: [ ...currentImages, ...imageNames]
      })),
      switchMap( (updatedProduct) => 
        this.http.patch<Product>(`${ baseUrl }/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
    // return this.http.patch<Product>(`${ baseUrl }/products/${id}`, productLike)
    // .pipe(
    //   tap((product) => this.updateProductCache(product))
    // );
  }

  updateProductCache( product: Product){
    const productId = product.id

    this.productCache.set( productId, product );

    this.productsCache.forEach( productResponse => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id == product.id ? product : currentProduct;
      });
    })
    console.log("Cache actualizado")
  }

  uploadImages( images?: FileList ): Observable<string[]>{
    if( !images ) return of([]);

    const uploadObservables = Array.from( images ).map(imageFile => this.uploadImage(imageFile))
    
    return forkJoin(uploadObservables);
  }

  uploadImage( imageFile: File ): Observable<string>{
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
    .pipe(
      map((resp) => resp.fileName)
    );
  }
}