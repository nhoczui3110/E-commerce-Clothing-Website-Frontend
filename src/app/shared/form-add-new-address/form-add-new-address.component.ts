import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShipService } from '../service/ship.service';
import { Address } from '../address.model';

@Component({
  selector: 'app-form-add-new-address',
  templateUrl: './form-add-new-address.component.html',
  styleUrls: ['./form-add-new-address.component.css'],
})
export class FormAddNewAddressComponent implements OnInit {
  isFetching = false;
  form: FormGroup;
  cityList: { id: string; name: string }[] = [];
  districtList: { id: string; name: string }[] = [];
  wardList: { id: string; name: string }[] = [];
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  @Input('formData') formData: Address = null;

  constructor(private fb: FormBuilder, private shipService: ShipService) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      city: this.fb.group({
        id: [''],
        name: ['', Validators.required],
      }),
      district: this.fb.group({
        id: [''],
        name: ['', Validators.required],
      }),
      ward: this.fb.group({
        id: [''],
        name: ['', Validators.required],
      }),
      street: ['', Validators.required],
    });
    this.shipService.getCities().subscribe((res) => {
      this.cityList = res['data'];
      if (this.formData) {
        this.updateFormValues();
      } else {
        this.isFetching = false;
      }
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.formData && changes.formData.currentValue) {
  //     this.updateFormValues();
  //   }
  // }

  private async updateFormValues() {
    if (this.formData) {
      this.form.patchValue(this.formData);
      await this.onChangeCity(this.formData.city.name);
      await this.onChangeDistrict(this.formData.district.name);
      await this.onChangeWard(this.formData.ward.name);
      this.isFetching = false;
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.value);
  }

  onCancel() {
    this.formSubmit.emit(false);
  }

  onChangeCity(cityName: string): Promise<void> {
    return new Promise((resolve) => {
      const city = this.cityList.find((c) => c.name === cityName);
      this.form.get('city').patchValue({ id: city?.id });
      this.districtList = [];
      this.wardList = [];

      this.shipService.getDistrictsByCity(city?.id).subscribe((res) => {
        this.districtList = res['data'];
        resolve(); // Đảm bảo Promise hoàn thành khi districtList đã được cập nhật
      });
    });
  }

  onChangeDistrict(districtName: string): Promise<void> {
    return new Promise((resolve) => {
      const district = this.districtList.find((d) => d.name === districtName);
      this.form.get('district').patchValue({ id: district?.id });
      this.wardList = [];
      this.shipService.getWardsByDistrict(district?.id).subscribe((res) => {
        this.wardList = res['data'];
        resolve();
      });
    });
  }

  onChangeWard(wardName: string): Promise<void> {
    return new Promise((resolve) => {
      const ward = this.wardList.find((w) => w.name === wardName);
      this.form.get('ward').patchValue({ id: ward?.id });
      resolve();
    });
  }
}
