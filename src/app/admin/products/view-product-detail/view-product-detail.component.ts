import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/product.model';
import { ProductService } from '../../../shared/service/product.service';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../shared/service/category.service';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrl: './view-product-detail.component.css',
})
export class ViewProductDetailComponent implements OnInit {
  @ViewChild('variantContainer', { static: false })
  variantContainer: ElementRef;
  productForm: FormGroup;
  stateAddProduct: string = null;
  title: string = null;
  msg: string = null;
  delay: number = 4;
  idTimeOut = null;
  categories: [] = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      slug: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')],
      ],
      description: ['', Validators.required],
      category: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      variants: this.fb.array([], Validators.required),
    });
  }

  setProductFormValues(product: Product) {
    this.productForm.patchValue({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category.slug,
      price: product.price,
    });

    const variantsFormArray = this.productForm.get('variants') as FormArray;
    variantsFormArray.clear(); // Clear old values

    product.variants.forEach((variant) => {
      const sizesFormArray = this.fb.array(
        variant.size.map((s) => this.fb.control(s.sizeName)) // Populate sizes
      );

      const variantFormGroup = this.fb.group({
        colorName: [
          { value: variant.colorName, disabled: true },
          Validators.required,
        ],
        size: sizesFormArray,
        img: [variant.imageUrl],
      });

      variantsFormArray.push(variantFormGroup); // Add variant group to the form
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

  removeVariant(index: number): void {
    if (this.variants.length == 1) {
      return;
    }
    console.log(index);
    console.log(this.variants.controls);
    this.variants.removeAt(index);
    this.onChangeVariant(index - 1 > 0 ? index - 1 : this.variants.length - 1);
  }

  onSizeChange(event: any, variantIndex: number): void {
    const sizes = this.variants.at(variantIndex).get('size') as FormArray;
    console.log(sizes);
    if (event.target.checked) {
      sizes.push(this.fb.control(event.target.value));
    } else {
      const index = sizes.controls.findIndex(
        (x) => x.value === event.target.value
      );
      sizes.removeAt(index);
    }
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

      // Get the file extension (e.g., 'jpg', 'png')
      const fileExtension = file.name.split('.').pop();

      // Create a new file name (e.g., 'variant-0.jpg')
      const newFileName = `variant-${index}.${fileExtension}`;

      // Create a new file with the updated name
      const renamedFile = new File([file], newFileName, {
        type: file.type, // The MIME type should be used here (e.g., 'image/jpeg')
      });

      // Update the form control with the renamed file
      const variantControl = this.variants.at(index) as FormGroup;
      variantControl.patchValue({
        img: renamedFile,
      });
    }
  }

  onSubmit(): void {
    console.log(this.productForm);
    clearTimeout(this.idTimeOut);
    this.stateAddProduct = null;
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name').getRawValue());
      formData.append('slug', this.productForm.get('slug').getRawValue());
      formData.append(
        'description',
        this.productForm.get('description').getRawValue()
      );
      formData.append(
        'price',
        this.productForm.get('price').getRawValue().toString()
      );
      formData.append('category', this.productForm.get('category').value); // Adjust if necessary

      this.productForm.getRawValue().variants.forEach((variant: any) => {
        if (variant.img) {
          formData.append('img', variant.img);
        }

        const variantData = {
          colorName: variant.colorName,
          size: variant.size,
        };
        formData.append('variants[]', JSON.stringify(variantData));
      });

      console.log('Form Data:', formData);

      this.productService.updateProduct(formData, this.product.slug).subscribe({
        complete: () => {
          this.stateAddProduct = 'success';
          this.title = 'Success';
          this.msg = 'Thêm sản phẩm thành công!';
          this.idTimeOut = setTimeout(() => {
            this.stateAddProduct = null;
          }, this.delay * 1000);
          clearTimeout(this.idTimeOut);
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
      });
    } else {
      console.error('Form is invalid');
    }
  }
  slug: string;
  product: Product;
  isEdit = false;
  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.route.queryParams.subscribe((params) => {
      this.isEdit = !!params['isEdit'];
    });
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result['categories'];
    });
    this.productService.getProductDetail(this.slug).subscribe({
      next: (product) => {
        this.product = product;
        this.initForm(); // Khởi tạo form trước
        if (this.isEdit) {
          this.setProductFormValues(this.product); // Đổ dữ liệu vào form
          console.log(this.productForm.value);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
