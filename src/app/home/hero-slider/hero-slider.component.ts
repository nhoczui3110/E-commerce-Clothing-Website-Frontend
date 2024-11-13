import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Slider } from '../../shared/service/configuration.service';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.css',
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  // infoList: { title: string; desc: string; imgUrl: string }[] = [
  //   {
  //     title: 'Find the best styles of modern shoes',
  //     desc: 'The most wanted styles is waiting for you. Find the best styles of modern shoes for you .',
  //     imgUrl:
  //       'http://localhost:4200/assets/img/pexels-arshamhaghani-3536991.jpg',
  //   },
  //   {
  //     title: 'Find the best styles of modern shoes',
  //     desc: 'The most wanted styles is waiting for you. Find the best styles of modern shoes for you .',
  //     imgUrl:
  //       'http://localhost:4200/assets/img/pexels-arshamhaghani-3536991.jpg',
  //   },
  //   {
  //     title: 'Find the best styles of modern shoes',
  //     desc: 'The most wanted styles is waiting for you. Find the best styles of modern shoes for you .',
  //     imgUrl:
  //       'http://localhost:4200/assets/img/pexels-arshamhaghani-3536991.jpg',
  //   },
  // ];
  @Input('slider') slider: Slider = { list: [], interval: 3000 };
  @ViewChild('heroList', {
    static: true,
  })
  heroList: ElementRef;
  count: number = 1;
  interval = null;
  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    console.log(this.slider);
    this.interval = setInterval(() => {
      if (this.count >= this.slider.list.length) {
        this.count = 1;
        this.renderer.setStyle(
          this.heroList.nativeElement,
          'transform',
          'translateX(0)'
        );
      } else {
        this.renderer.setStyle(
          this.heroList.nativeElement,
          'transform',
          `translateX(${100 * this.count * -1}%)`
        );
        this.count++;
      }
    }, this.slider.interval);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
