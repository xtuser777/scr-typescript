import Database from '../util/database';
import Employee from '../model/Employee';
import PhysicalPerson from '../model/PhysicalPerson';

const showEmployees = async (): Promise<void> => {
  await Database.instance.open();
  const employees = await new Employee().get();
  await Database.instance.close();

  for (const employee of employees) {
    console.log(employee);
  }
};

const showEmployeeById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const employee = (await new Employee().get({ id }))[0];
  await Database.instance.close();

  console.log(employee);
};

const showSellers = async (): Promise<void> => {
  await Database.instance.open();
  const sellers = await new Employee().get({ type: 2 });
  await Database.instance.close();

  for (const seller of sellers) {
    console.log(seller);
  }
};

const insertEmployee = async (employee: Employee): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await employee.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateEmployee = async (employee: Employee): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await employee.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deleteEmployee = async (id: number): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await new Employee(id).delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

// insertEmployee(
//   new Employee(0, 1, new Date(Date.now()), undefined, new PhysicalPerson(3)),
// );

// updateEmployee(
//   new Employee(2, 2, new Date(Date.now()), undefined, new PhysicalPerson(3)),
// );

//showSellers();

//deleteEmployee(2);

showEmployees();
