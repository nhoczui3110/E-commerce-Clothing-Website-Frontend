import { Component, OnInit } from '@angular/core';
import { Address } from '../address.model';
import { UserService } from '../service/user.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent implements OnInit {
  address: Address[] = [];
  isFail = false;
  isSuccess = false;
  isShowFormAddress = false;
  delay = 3;
  message = '';
  editAddress: Address = null;
  faTrash = faTrash;
  faEdit = faEdit;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.onGetAddress();
  }
  onGetAddress() {
    this.setFalseStatus();
    this.userService.getProfileUser().subscribe({
      error: (err) => {
        console.log(err);
      },
      next: (res) => {
        console.log(res);
        this.address = res['address'];
        console.log(this.address);
      },
    });
  }
  setFalseStatus() {
    this.isSuccess = false;
    this.isFail = false;
  }
  onShowAddressForm() {
    this.isShowFormAddress = true;
  }
  onSetDefaultAddress(addressId) {
    this.setFalseStatus();
    this.userService.setDefaultAddress(addressId).subscribe({
      error: (err) => {
        this.isFail = true;
        this.message = err;
        setTimeout(() => {
          this.isFail = false;
        }, this.delay * 1000);
      },
      next: (res) => {
        this.isSuccess = true;
        this.message = res['message'];
        this.address = res['address'];
        setTimeout(() => {
          this.isSuccess = false;
        }, this.delay * 1000);
      },
    });
  }
  onDeleteAddress(addressId) {
    this.setFalseStatus();
    this.userService.deleteAddress(addressId).subscribe({
      error: (err) => {
        this.isFail = true;
        this.message = err;
        setTimeout(() => {
          this.isFail = false;
        }, this.delay * 1000);
      },
      next: (res) => {
        this.isSuccess = true;
        this.message = res['message'];
        this.address = res['address'];
        setTimeout(() => {
          this.isSuccess = false;
        }, this.delay * 1000);
      },
    });
  }
  onUpdateAddress(address: Address) {
    this.editAddress = address;
    this.onShowAddressForm();
  }
  handleFromAddress(result) {
    console.log(result);
    this.setFalseStatus();
    if (!result) {
      this.isShowFormAddress = false;
      this.editAddress = null;
      return;
    }
    if (!this.editAddress) {
      this.userService.addNewAddress(result).subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          this.isShowFormAddress = false;
          this.message = res['message'];
          this.address = res['user'].address;
          this.isSuccess = true;
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
    } else {
      console.log(this.editAddress);
      this.userService.updateAddress(this.editAddress._id, result).subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          this.editAddress = null;
          this.isShowFormAddress = false;
          this.message = res['message'];

          // Tìm vị trí của địa chỉ cần thay thế trong mảng
          const addressIndex = this.address.findIndex(
            (add) => add['_id'] === res['address']._id
          );

          // Thay thế địa chỉ tại vị trí tìm được bằng địa chỉ mới từ response
          if (addressIndex !== -1) {
            this.address.splice(addressIndex, 1, res['address'] as never);
          }

          this.isSuccess = true;
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
    }
  }
}
