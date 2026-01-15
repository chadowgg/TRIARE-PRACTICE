type Employee = {
  id: number;
  name: string;
  department: string;
};

type Manager = {
  id: number;
  name: string;
  employees: Employee[];
};

type Staff = Employee | Manager;

function printStaffDetails(args: Staff): void {
  if ('employee' in args) {
    console.log(`Is manager ${args.name}`);
  } else {
    console.log(`Is employee ${args.name}`);
  }
}

const person1: Employee = {
  id: 1,
  name: 'person',
  department: 'Department',
};

const person2: Employee = {
  id: 2,
  name: 'person2',
  department: 'Department2',
};

const person3: Manager = {
  id: 1,
  name: 'manager',
  employees: [person1, person2],
};

printStaffDetails(person1);
printStaffDetails(person3);