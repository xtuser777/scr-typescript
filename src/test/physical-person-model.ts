import Database from '../util/database';
import Contact from '../model/Contact';
import PhysicalPerson from '../model/PhysicalPerson';

const showPersons = async (): Promise<void> => {
  await Database.instance.open();
  const result = await new PhysicalPerson().get();
  await Database.instance.close();

  for (const person of result) {
    console.log(person);
  }
};

const showPersonById = async (): Promise<void> => {
  await Database.instance.open();
  const result = await new PhysicalPerson().get({ id: 3 });
  await Database.instance.close();

  console.log(result[0]);
};

const insertPerson = async (): Promise<void> => {
  const contact = new Contact(3);
  const date = new Date(Date.now());
  const person = new PhysicalPerson(
    0,
    'Teste 2',
    '11.111.111-2',
    '111.111.111-22',
    date,
    contact,
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await person.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updatePerson = async (): Promise<void> => {
  const contact = new Contact(3);
  const date = new Date(Date.now());
  const person = new PhysicalPerson(
    3,
    'Teste 1',
    '11.111.111-0',
    '111.111.111-00',
    date,
    contact,
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await person.update();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deletePerson = async (): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await new PhysicalPerson(4).delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const countCpf = async (): Promise<void> => {
  await Database.instance.open();
  const count = await new PhysicalPerson().countCpf('111.111.111-00');
  await Database.instance.close();

  console.log(count);
};

countCpf();
