import Database from '../util/database';
import User from '../model/User';
import Level from '../model/Level';
import Employee from '../model/Employee';

const showUsers = async (): Promise<void> => {
  await Database.instance.open();
  const users = await new User().get();
  await Database.instance.close();

  for (const user of users) {
    console.log(user);
  }
};

const showUserById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const user = (await new User().get({ id }))[0];
  await Database.instance.close();

  console.log(user);
};

const showUserByAuthentication = async (
  login: string,
  password: string,
): Promise<void> => {
  await Database.instance.open();
  const user = (await new User().get({ login, password }))[0];
  await Database.instance.close();

  console.log(user);
};

const showUsersByAdmission = async (admission: string): Promise<void> => {
  await Database.instance.open();
  const users = await new User().get({ employeeAdmission: admission });
  await Database.instance.close();

  for (const user of users) {
    console.log(user);
  }
};

const showUsersByKey = async (
  login: string,
  personName: string,
  contactId: number,
): Promise<void> => {
  await Database.instance.open();
  const users = await new User().get({ login, personName, contactId });
  await Database.instance.close();

  for (const user of users) {
    console.log(user);
  }
};

const showUsersByKeyAdmission = async (
  login: string,
  personName: string,
  contactId: number,
  employeeAdmission: string,
): Promise<void> => {
  await Database.instance.open();
  const users = await new User().get({ login, personName, contactId, employeeAdmission });
  await Database.instance.close();

  for (const user of users) {
    console.log(user);
  }
};

const showAdminCount = async (): Promise<void> => {
  await Database.instance.open();
  const count = await new User().adminCount();
  await Database.instance.close();

  console.log(count);
};

const showLoginCount = async (login: string): Promise<void> => {
  await Database.instance.open();
  const count = await new User().loginCount(login);
  await Database.instance.close();

  console.log(count);
};

const insertUser = async (user: User): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await user.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateUser = async (user: User): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await user.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deleteUser = async (id: number): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await new User(id).delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

showUsers();
// showUserById(1);
// showUsersByAdmission('2023-01-15');
// showUserByAuthentication('suporte', '121314');
// showUsersByKey('Supo', '', 0);
// showUsersByKeyAdmission('', '', 0, '');
// showAdminCount();
// showLoginCount('admin');
// insertUser(new User(0, 'teste', '123456', true, new Employee(3), new Level(1)));
// updateUser(new User(2, 'teste2', '1234567', true, new Employee(3), new Level(1)));
