import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ConfigurationService,
  Slider,
  SliderItem,
} from '../../../shared/service/configuration.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-hero-slider',
  templateUrl: './change-hero-slider.component.html',
  styleUrl: './change-hero-slider.component.css',
})
export class ChangeHeroSliderComponent implements OnInit {
  slides: Slider = {
    list: [],
    interval: 5000, // khoảng thời gian chuyển ảnh
  };
  @ViewChild('imageInput') imageInput: ElementRef;
  currentSlide = 0;
  newSlide: SliderItem = { title: '', description: '', imageUrl: '', slug: '' };
  showAddForm = false;
  selectedImage: File | null = null;
  constructor(private configService: ConfigurationService) {}
  ngOnInit(): void {
    this.configService.getSlider().subscribe((res) => {
      this.slides = res;
      console.log(this.slides);
      setInterval(() => this.nextSlide(), this.slides.interval);
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.list.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.list.length) %
      this.slides.list.length;
  }

  addSlide(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    if (!this.selectedImage) {
      console.log('Không có ảnh đã chọn!');
      return;
    }

    // Thêm newSlide vào list slides
    this.slides.list.push(this.newSlide);
    console.log(this.slides);

    const formData = new FormData();

    formData.append('slider', JSON.stringify(this.slides));

    // Thêm ảnh được chọn vào FormData
    if (this.selectedImage) {
      formData.append('img', this.selectedImage, this.selectedImage.name);
    }

    // Gọi API để gửi dữ liệu
    this.configService.putSlider(formData).subscribe((res) => {
      form.resetForm();
      this.imageInput.nativeElement.value = null;
      this.slides = res;
    });
  }

  removeSlide(index: number): void {
    this.slides.list.splice(index, 1);
    if (this.currentSlide >= this.slides.list.length) {
      this.currentSlide = this.slides.list.length - 1;
    }
    const formData = new FormData();

    formData.append('slider', JSON.stringify(this.slides));
    this.configService.putSlider(formData).subscribe((res) => {
      this.slides = res;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      this.selectedImage = input.files[0];
    }
  }
}
