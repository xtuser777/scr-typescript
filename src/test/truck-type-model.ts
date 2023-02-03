import Database from '../util/database';
import TruckType from '../model/TruckType';

const showTrucktypes = async (): Promise<void> => {
  await Database.instance.open();
  const types = await new TruckType().get();
  await Database.instance.close();

  for (const type of types) {
    console.log(type);
  }
};

const showTrucktypeById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const type = (await new TruckType().get({ id }))[0];
  await Database.instance.close();

  console.log(type);
};

const showTrucktypesByDescription = async (description: string): Promise<void> => {
  await Database.instance.open();
  const types = await new TruckType().get({ description });
  await Database.instance.close();

  for (const type of types) {
    console.log(type);
  }
};

const insertType = async (type: TruckType): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await type.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateType = async (type: TruckType): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await type.update();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deleteType = async (id: number): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await new TruckType(id).delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

// showTrucktypes();
// showTrucktypeById(2);
// showTrucktypesByDescription('df');
// insertType(new TruckType(0, 'Teste 1', 1, 1001));
// updateType(new TruckType(1, 'Teste 01', 1, 11001));
// deleteType(2);
