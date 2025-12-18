import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
  .swiper{
    width: 100%;
    height: 500px;
  }
  `
})
export class ProductCarousel implements AfterViewInit, OnChanges{

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper|undefined = undefined;

  //Reiniciamos el carousel cuando cambian las imagenes delc arousel que queremos poner
  ngOnChanges(changes: SimpleChanges): void {
    if( changes['images'].firstChange ){
      return;
    }
    if( !this.swiper ) return;

    this.swiper.destroy(true, true)

    const paginationEl = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';
    setTimeout(() => {
      this.swiperInit();
    }, 500)
  } 

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit(){
    const element = this.swiperDiv().nativeElement;
    if( !element ) return;
    
    this.swiper = new Swiper( element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation, Pagination
      ],
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
