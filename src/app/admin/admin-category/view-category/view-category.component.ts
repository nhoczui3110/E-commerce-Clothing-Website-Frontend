import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/service/category.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css',
})
export class ViewCategoryComponent implements OnInit {
  categories: [] = [];
  stateDeleteCategory = null;
  showConfirmDeleteBox = false;
  slugToDelete = null;
  isFetching = false;
  title: string = null;
  msg: string = null;
  delay: number = 4;
  idTimeOut = null;
  faTrash = faTrash;
  faEdit = faEdit;
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.isFetching = true;
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result['categories'];
      this.isFetching = false;
    });
  }

  onDeleteCategory(slug: string) {
    this.slugToDelete = slug;
    this.showConfirmDeleteBox = true;
  }

  handleDeleteCategory(result: boolean) {
    this.showConfirmDeleteBox = false;
    if (result) {
      this.isFetching = true;
      this.categoryService.deleteCategory(this.slugToDelete).subscribe({
        complete: () => {
          this.stateDeleteCategory = 'success';
          this.msg = 'Xóa sản phẩm thành công!';
          this.title = 'Success';
          this.idTimeOut = setTimeout(() => {
            this.stateDeleteCategory = null;
          }, this.delay * 1000);
          this.categoryService.getCategories().subscribe((result) => {
            this.categories = result['categories'];
          });
          this.isFetching = false;
        },
        error: (err) => {
          console.log('vao loi nay');
          this.stateDeleteCategory = 'error';
          this.msg = err;
          this.title = 'Error';
          this.idTimeOut = setTimeout(() => {
            this.stateDeleteCategory = null;
          }, this.delay * 1000);
          this.isFetching = false;
        },
      });
    }
  }
}
