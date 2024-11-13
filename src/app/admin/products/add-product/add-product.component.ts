import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../shared/service/product.service';
import { Product } from '../../../shared/product.model';
import { CategoryService } from '../../../shared/service/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  @ViewChild('variantContainer', { static: false })
  variantContainer: ElementRef;
  productForm: FormGroup;
  stateAddProduct: string = null;
  title: string = null;
  msg: string = null;
  delay: number = 4;
  idTimeOut = null;
  categories: [] = [];
  @ViewChildren('imageInput') imageInputList: QueryList<ElementRef>;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result['categories'];
    });
  }
  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      slug: [
        '',
        [Validators.required, Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')],
      ],
      description: ['', Validators.required],
      category: [null, Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      variants: this.fb.array([this.initVariant()], Validators.required),
    });
  }

  initVariant(): FormGroup {
    return this.fb.group({
      colorName: ['', Validators.required],
      size: this.fb.array([], this.atLeastOneCheckboxChecked()),
      img: [null, Validators.required],
    });
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant(): void {
    this.variants.push(this.initVariant());
  }

  onChangeVariant(index: number) {
    const variantWidth = this.variantContainer.nativeElement.offsetWidth;
    const translateX = -variantWidth * index;
    this.variantContainer.nativeElement.style.transform = `translateX(${translateX}px)`;
    let btnVariants = document.querySelectorAll('.btn-change-variant');
    console.log(btnVariants);
    btnVariants.forEach((btn, i) => {
      btn.classList.remove('active');
      if (i === index) {
        btn.classList.add('active');
      }
    });
  }

  removeVariant(index: number): void {
    if (this.variants.length == 1) {
      return;
    }
    this.variants.removeAt(index);
    this.onChangeVariant(index - 1 > 0 ? index - 1 : this.variants.length - 1);
  }

  onSizeChange(event: any, variantIndex: number): void {
    const sizes = this.variants.at(variantIndex).get('size') as FormArray;

    if (event.target.checked) {
      sizes.push(this.fb.control(event.target.value));
    } else {
      const index = sizes.controls.findIndex(
        (x) => x.value === event.target.value
      );
      sizes.removeAt(index);
    }
  }

  atLeastOneCheckboxChecked(): ValidatorFn {
    return (formArray: FormArray): { [key: string]: boolean } | null => {
      const checked = formArray.controls.some((control) => control.value);
      return checked ? null : { required: true };
    };
  }

  onImageSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const variantControl = this.variants.at(index) as FormGroup;
      variantControl.patchValue({
        img: file,
      });
    }
  }

  clearImgInput() {}

  onSubmit(): void {
    clearTimeout(this.idTimeOut);
    this.stateAddProduct = null;
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name').value);
      formData.append('slug', this.productForm.get('slug').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value.toString());
      formData.append('category', this.productForm.get('category').value); // Adjust if necessary

      this.productForm.value.variants.forEach((variant: any) => {
        if (variant.img) {
          formData.append('img', variant.img);
        }

        const variantData = {
          colorName: variant.colorName,
          size: variant.size,
        };
        formData.append('variants[]', JSON.stringify(variantData));
      });

      // console.log('Form Data:', formData);
      console.log(formData.getAll('variants'));
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          this.stateAddProduct = 'success';
          this.title = 'Success';
          this.msg = 'Thêm sản phẩm thành công!';
          this.idTimeOut = setTimeout(() => {
            this.stateAddProduct = null;
          }, this.delay * 1000);
          clearTimeout(this.idTimeOut);
          this.imageInputList.toArray().forEach((imageInput) => {
            imageInput.nativeElement.value = null;
            console.log(imageInput);
          });
          this.initForm();
          this.onChangeVariant(0);
        },
        error: (error) => {
          this.stateAddProduct = 'error';
          this.title = 'Error';
          this.msg = error;
          this.idTimeOut = setTimeout(() => {
            this.stateAddProduct = null;
          }, this.delay * 1000);
          clearTimeout(this.idTimeOut);
        },
        complete: () => {},
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
