import Database from '../util/database';
import Contact from '../model/Contact';
import LegalPerson from '../model/LegalPerson';

const showPersons = async (): Promise<void> => {
  await Database.instance.open();
  const persons = await new LegalPerson().get();
  await Database.instance.close();

  for (const person of persons) {
    console.log(person);
  }
};

const showPersonById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const person = (await new LegalPerson().get({ id }))[0];
  await Database.instance.close();

  console.log(person);
};

const insertPerson = async (person: LegalPerson): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await person.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updatePerson = async (person: LegalPerson): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await person.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deletePerson = async (id: number): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await new LegalPerson(id).delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

showPersons();
// insertPerson(
//   new LegalPerson(
//     0,
//     'GLOBO TRANSPORTES E REPRESENTACOES LTDA',
//     'Globo Transportes',
//     '05.519.090/0001-45',
//     new Contact(2),
//   ),
// );

// updatePerson(
//   new LegalPerson(1, 'Teste 1', 'Teste Testando 1', '11.111.111/0001-11', new Contact(3)),
// );

//deletePerson(2);
