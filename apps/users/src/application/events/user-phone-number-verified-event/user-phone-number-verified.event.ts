export class UserPhoneNumberVerfiedEvent {
  public constructor(
    public readonly phoneNumberVerfiedEventDto: {
      id: string;
      phoneNumber: string;
    },
  ) {}
}
