import Database from '../util/database';
import PhysicalPerson from '../model/PhysicalPerson';
import LegalPerson from '../model/LegalPerson';
import Client from '../model/Client';

const showClients = async (): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get();
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const client = (await new Client().get({ id }))[0];
  await Database.instance.close();

  console.log(client);
};

const showClientsByFilterPeriodType = async (
  name: string,
  fantasyName: string,
  email: string,
  initial: string,
  end: string,
  type: number,
): Promise<void> => {};
