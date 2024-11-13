import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.css',
})
export class ImageCropperComponent {
  faPlus = faPlus;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  private croppedBlob: Blob | null = null;
  @Input() defaultImageSrc: string | null = null;
  @Output() confirmEvent: EventEmitter<Blob | null> = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) {}

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    if (event.target['files'].length === 0) {
      this.imageChangedEvent = null;
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    this.croppedBlob = event.blob || null; // Lưu Blob vào biến `croppedBlob`
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
    console.log(image);
  }
  cropperReady() {
    // cropper ready
    // console.log('event ready');
  }
  loadImageFailed() {
    // show message
    console.log('fail');
  }
  onSave() {
    this.confirmEvent.emit(this.croppedBlob); // Emit khi nhấn "Lưu"
  }
  onCancel() {
    this.confirmEvent.emit(null); // Emit null khi nhấn "Hủy"
  }
}
