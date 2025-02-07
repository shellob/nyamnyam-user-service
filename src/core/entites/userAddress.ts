export class UserAddress {
    constructor(
        public id: string,
        public userId: string,
        public address: string,
        public city: string,
        public postalCode: string,
        public isDefault: boolean = false,
        public createdAt: Date = new Date(),
        public updatedAt?: Date
    ) {}

    updateAddress(newAddress: string, newCity: string, newPostalCode: string) {
        this.address = newAddress;
        this.city = newCity;
        this.postalCode = newPostalCode;
        this.updatedAt = new Date();
    }

    setDefault() {
        this.isDefault = true;
        this.updatedAt = new Date();
    }
}
