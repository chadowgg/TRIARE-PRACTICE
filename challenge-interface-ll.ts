interface Person {
  name: string;
}

interface DogOwner extends Person {
  dogName: string;
}

interface Manager extends Person {
  managerName(): void;
  delegateTasks(): void;
}

function getEmployee(): Person | DogOwner | Manager {
  const randomNumber: number = Math.random();
  if (randomNumber < 0.33) {
    return {name: 'New Person'};
  } else if (randomNumber < 0.66) {
    return {
      name: 'Person',
      dogName: 'Dog',
    }
  } else {
    return {
      name: 'Person',
      managerName() {
        console.log("Manager name");
      },
      delegateTasks() {
        console.log("Delegate tasks");
      },
    };
  }
}

console.log(getEmployee());
console.log(getEmployee());
console.log(getEmployee());
