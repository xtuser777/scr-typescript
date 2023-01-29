import Database from '../util/database';
import Representation from '../model/Representation';
import LegalPerson from '../model/LegalPerson';

const showRepresentations = async (): Promise<void> => {
  await Database.instance.open();
  const representations = await new Representation().get();
  await Database.instance.close();

  for (const representation of representations) console.log(representation);
};

const showRepresentationById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const representation = (await new Representation().get({ id }))[0];
  await Database.instance.close();

  console.log(representation);
};

const showRepresentationsByRegistry = async (register: string): Promise<void> => {
  await Database.instance.open();
  const representations = await new Representation().get({ register });
  await Database.instance.close();

  for (const representation of representations) console.log(representation);
};

const showRepresentationsByKey = async (
  fantasyName: string,
  email: string,
): Promise<void> => {
  await Database.instance.open();
  const representations = await new Representation().get({ fantasyName, email });
  await Database.instance.close();

  for (const representation of representations) console.log(representation);
};

const showRepresentationsByKeyRegistry = async (
  fantasyName: string,
  email: string,
  register: string,
): Promise<void> => {
  await Database.instance.open();
  const representations = await new Representation().get({
    fantasyName,
    email,
    register,
  });
  await Database.instance.close();

  for (const representation of representations) console.log(representation);
};

const insertRepresentation = async (representation: Representation): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await representation.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateRepresentation = async (representation: Representation): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await representation.update();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deleteRepresentation = async (id: number): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await new Representation(id).delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

showRepresentations();
// insertRepresentation(
//   new Representation(
//     0,
//     new Date().toISOString().substring(0, 10),
//     'unit 2',
//     new LegalPerson(1),
//   ),
// );
// updateRepresentation(
//   new Representation(
//     1,
//     new Date().toISOString().substring(0, 10),
//     'unit 1',
//     new LegalPerson(1),
//   ),
// );
// deleteRepresentation(2);
