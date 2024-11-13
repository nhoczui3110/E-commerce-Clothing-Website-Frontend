import { Component, OnInit } from '@angular/core';
import {
  ConfigurationService,
  PriceFilter,
  PriceFilterItem,
} from '../../../shared/service/configuration.service';
import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-price-filter',
  templateUrl: './change-price-filter.component.html',
  styleUrl: './change-price-filter.component.css',
})
export class ChangePriceFilterComponent implements OnInit {
  isFetching = false;
  priceRanges: PriceFilter = [];
  tempPriceRanges: PriceFilter = [];
  pendingChanges = false;
  minPrice: string = '';
  maxPrice: string = '';
  price: string = '';
  faPlus = faPlus;
  faTrash = faTrash;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  filterType = 'price-range';
  ngOnInit(): void {
    this.isFetching = true;
    this.configurationService.getPriceFilter().subscribe((res) => {
      this.priceRanges = [...res];
      this.tempPriceRanges = [...res];
      this.isFetching = false;
    });
  }
  constructor(private configurationService: ConfigurationService) {}
  addPriceRange(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    let newRange: PriceFilterItem;
    if (this.filterType === 'price-range') {
      const min = parseFloat(this.minPrice);
      const max = parseFloat(this.maxPrice);
      newRange = { min, max };
    } else {
      const price = parseFloat(this.price);
      if (this.filterType === 'greater-than') {
        newRange = { min: price };
      } else {
        newRange = { max: price };
      }
    }
    this.tempPriceRanges.push(newRange);
    this.configurationService
      .putPriceFilter(this.tempPriceRanges)
      .subscribe((res) => {
        this.tempPriceRanges = res;
        this.priceRanges = res;
        form.reset();
      });
  }

  deletePriceRange(index: number): void {
    this.tempPriceRanges.splice(index, 1);
    console.log(this.tempPriceRanges);
    this.pendingChanges = true;
  }
  saveChanges(): void {
    this.priceRanges = [...this.tempPriceRanges];
    this.pendingChanges = false;
    this.configurationService
      .putPriceFilter(this.priceRanges)
      .subscribe((res) => {});
  }
  cancelChanges(): void {
    this.tempPriceRanges = [...this.priceRanges];
    this.pendingChanges = false;
  }
  movePriceRange(index: number, direction: 'up' | 'down'): void {
    const newPriceRanges = [...this.tempPriceRanges];
    if (direction === 'up' && index > 0) {
      [newPriceRanges[index - 1], newPriceRanges[index]] = [
        newPriceRanges[index],
        newPriceRanges[index - 1],
      ];
    } else if (
      direction === 'down' &&
      index < this.tempPriceRanges.length - 1
    ) {
      [newPriceRanges[index], newPriceRanges[index + 1]] = [
        newPriceRanges[index + 1],
        newPriceRanges[index],
      ];
    }
    this.tempPriceRanges = newPriceRanges;
    this.pendingChanges = true;
  }

  onChangeFilterType(type) {
    this.filterType = type;
  }
}
