import Database from '../util/database';
import Parameterization from '../model/Parameterization';
import LegalPerson from '../model/LegalPerson';

const showParameterization = async (): Promise<void> => {
  await Database.instance.open();
  const parameterization = new Parameterization().get();
  await Database.instance.close();

  console.log(parameterization);
};

const insertParameterization = async (
  parameterization: Parameterization,
): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await parameterization.save();
  if (result >= 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateParameterization = async (
  parameterization: Parameterization,
): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await parameterization.update();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

// insertParameterization(new Parameterization(1, '', new LegalPerson(1)));
showParameterization();
// updateParameterization(new Parameterization(1, 'teste', new LegalPerson(1)));
