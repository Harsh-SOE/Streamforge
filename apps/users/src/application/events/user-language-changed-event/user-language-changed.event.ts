export class UserLanguageChangedEvent {
  public constructor(
    public readonly langaugeChangedEventDto: { id: string; langauge: string },
  ) {}
}
