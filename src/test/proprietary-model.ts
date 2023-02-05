import Database from '../util/database';
import PhysicalPerson from '../model/PhysicalPerson';
import LegalPerson from '../model/LegalPerson';
import Proprietary from '../model/Proprietary';

const showProprietaries = async (): Promise<void> => {
  await Database.instance.open();
  const proprietaries = await new Proprietary().get();
  await Database.instance.close();

  for (const proprietary of proprietaries) {
    console.log(proprietary);
  }
};
