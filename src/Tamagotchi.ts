type TamagotchiStatus = 'ALIVE' | 'SLEEPING' | 'DEAD';

export class Tamagotchi {
  private name: string;
  private hunger: number = 100;
  private happiness: number = 100;
  private status: TamagotchiStatus = 'ALIVE';
  private energy: number = 100;
  private massage: string = '';

  constructor(name: string) {
    this.name = name;
  }

  public tick(): void {
    if (this.status === 'DEAD') return;

    if (this.status === 'SLEEPING') {
      this.energy = Math.min(100, this.energy + 5);
      this.hunger -= 1;

      if (this.energy >= 100) {
        this.wakeUp();
      }
    } else {
      this.hunger -= 2;
      this.happiness -= 1;
      this.energy -= 1;

      if (this.energy <= 0) {
        this.sleep();
      }
    }

    this.checkStatus();
  }

  private checkStatus(): void {
    if (this.hunger < 1) {
      this.status = 'DEAD';
      this.massage = 'Не витримав голод';
    } else if (this.happiness < 1) {
      this.status = 'DEAD';
      this.massage = 'Стало надто сумно';
    }
  }

  // private printStatus(): void {
  //   console.log(
  //     `Стан ${this.name}: Голод (${this.hunger}), Щастя (${this.happiness})`,
  //   );
  // }

  public feed(): void {
    if (this.status === 'DEAD') return;
    this.hunger = Math.min(100, this.hunger + 20);
    // console.log(`${this.name} поїв.`);
    // this.printStatus();
  }

  public play(): void {
    if (this.status === 'DEAD') return;
    this.happiness = Math.min(100, this.happiness + 15);
    this.hunger -= 5;
    // console.log(`${this.name} погралися`);
    // this.printStatus();
  }

  public setStatusAliveOrSleep(): void {
    this.status = this.status === 'ALIVE' ? 'SLEEPING' : 'ALIVE';
  }


  public sleep(): void {
    if (this.status === 'ALIVE') this.status = 'SLEEPING';
  }

  public wakeUp(): void {
    if (this.status === 'SLEEPING') this.status = 'ALIVE';
  }

  public getStats() {
    return {
      name: this.name,
      hunger: this.hunger,
      happiness: this.happiness,
      status: this.status,
      energy: this.energy,
      massage: this.massage,
    };
  }
}
