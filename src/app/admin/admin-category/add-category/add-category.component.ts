import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../shared/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  stateAddCategory: string = null;
  title: string = null;
  msg: string = null;
  delay: number = 4;
  idTimeOut = null;
  slugToEdit = null;
  category;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slugToEdit = params.get('slug'); // Lấy giá trị slug từ URL
      if (this.slugToEdit) {
        this.categoryService
          .getCategory(this.slugToEdit)
          .subscribe((result) => {
            console.log(result);
            this.category = result['category'];
            this.categoryForm.patchValue({
              name: this.category.name,
              slug: this.category.slug,
            });
          });
      }
    });
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: [
        '',
        [Validators.required, Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')],
      ],
      img: [null, this.slugToEdit ? [] : [Validators.required]],
    });
    // if (this.slugToEdit) {

    // }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.categoryForm.patchValue({ img: input.files[0] });
      this.categoryForm.get('img')?.updateValueAndValidity(); // Cập nhật trạng thái control
    }
  }
  onSubmit() {
    if (this.categoryForm.valid) {
      this.stateAddCategory = null;
      let data = this.categoryForm.value;
      console.log(data);
      const formData = new FormData();
      if (data.img) {
        formData.append('img', data.img);
      }
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (!this.slugToEdit) {
        this.categoryService.createCategory(formData).subscribe({
          complete: () => {
            this.stateAddCategory = 'success';
            this.title = 'Success';
            this.msg = 'Thêm sản phẩm thành công!';
            this.idTimeOut = setTimeout(() => {
              this.stateAddCategory = null;
            }, this.delay * 1000);
            clearTimeout(this.idTimeOut);
            this.categoryForm.reset();
          },
          error: (err) => {
            this.stateAddCategory = 'error';
            this.title = 'Error';
            console.log(err);
            this.msg = err;
            this.idTimeOut = setTimeout(() => {
              this.stateAddCategory = null;
            }, this.delay * 1000);
            clearTimeout(this.idTimeOut);
          },
        });
      } else {
        this.categoryService
          .updateCategory(formData, this.slugToEdit)
          .subscribe({
            next: (value) => {
              this.category = value['category'];
              this.stateAddCategory = 'success';
              this.title = 'Success';
              this.msg = 'Update sản phẩm thành công!';
              this.slugToEdit = this.categoryForm.get('slug').value;
              this.idTimeOut = setTimeout(() => {
                this.stateAddCategory = null;
              }, this.delay * 1000);
              this.router.navigate(['../', this.slugToEdit], {
                relativeTo: this.route,
              });
              clearTimeout(this.idTimeOut);
            },
            error: (err) => {
              this.stateAddCategory = 'error';
              this.title = 'Error';
              console.log('sdaasds');
              console.log(err);
              this.msg = err;
              this.idTimeOut = setTimeout(() => {
                this.stateAddCategory = null;
              }, this.delay * 1000);
              clearTimeout(this.idTimeOut);
            },
          });
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
