import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {
  transform(image: null | string | string[]): string {
    const defaultPath = './assets/images/no-image.jpg';

    if( image == null ){
      return defaultPath;
    }

    if( typeof image === 'string' && image.startsWith('blob:') ){
      return image;
    }
    
    if( typeof image === 'string' ){
      return `${baseUrl}/files/product/${image}`;
    }

    const hasValueImage = image.at(0);

    if( !hasValueImage ){
      return defaultPath;
    }

    return `${baseUrl}/files/product/${image[0]}`;
    
  }
}