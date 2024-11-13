import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnInit, OnChanges {
  pageArray: number[];
  @Input() pagination: { currentPage: number; totalPages: number };
  pageParam: number;

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.pageParam = +params.get('page') || 1;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination) {
      this.calculatePages();
    }
  }

  calculatePages(): void {
    let currentPage = this.pagination.currentPage;
    let totalPages = this.pagination.totalPages;
    let i = currentPage <= 2 ? 1 : currentPage - 2;
    let maxPageShow = currentPage >= totalPages - 5 ? totalPages : 5 + i;

    this.pageArray = [];
    for (; i <= maxPageShow; i++) {
      this.pageArray.push(i);
    }
  }

  navigateToPage(page: number): void {
    // Navigate to the desired page while keeping other query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page }, // Update only the 'page' param
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }
}
