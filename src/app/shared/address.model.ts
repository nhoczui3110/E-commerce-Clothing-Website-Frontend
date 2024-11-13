export interface Address {
  _id: string;
  lastName: string;
  firstName: string;
  phone: string;
  isDefault?: boolean;
  city: {
    id: string; // Mã thành phố
    name: string; // Tên thành phố
  };
  district: {
    id: string; // Mã quận/huyện
    name: string; // Tên quận/huyện
  };
  ward: {
    id: number; // Mã phường/xã
    name: string; // Tên phường/xã
  };
  street?: string; // Đường phố (tùy chọn)
}
