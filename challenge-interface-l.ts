interface Computer {
  readonly id: number;
  brand: string;
  ram: string;
  storage?: string
  upgradeRam(ram: number): string,
}

let computer: Computer = {
  id: 1,
  brand: 'asus',
  ram: '16gb',
  storage: '500gb',
  upgradeRam(ram: number): string {
    this.ram = `${ram.toString()}gb`;
    return this.ram;
  },
};

console.log(computer.upgradeRam(64));
console.log(computer)