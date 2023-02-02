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
): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({
    name,
    fantasyName,
    email,
    initial,
    end,
    type,
  });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByFilterPeriod = async (
  name: string,
  fantasyName: string,
  email: string,
  initial: string,
  end: string,
): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({
    name,
    fantasyName,
    email,
    initial,
    end,
  });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByFilter = async (
  name: string,
  fantasyName: string,
  email: string,
): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({
    name,
    fantasyName,
    email,
  });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByPeriodType = async (
  initial: string,
  end: string,
  type: number,
): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({
    initial,
    end,
    type,
  });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByPeriod = async (initial: string, end: string): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({
    initial,
    end,
  });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByType = async (type: number): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({ type });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByFilterRegister = async (
  name: string,
  fantasyName: string,
  email: string,
  register: string,
): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({
    name,
    fantasyName,
    email,
    register,
  });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const showClientsByRegister = async (register: string): Promise<void> => {
  await Database.instance.open();
  const clients = await new Client().get({ register });
  await Database.instance.close();

  for (const client of clients) {
    console.log(client);
  }
};

const insertClient = async (client: Client): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await client.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateClient = async (client: Client): Promise<void> => {
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await client.update();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const deleteClient = async (id: number): Promise<void> => {
  await Database.instance.open();
  const client = (await new Client().get({ id }))[0];
  await Database.instance.beginTransaction();
  const result = await client.delete();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

// showClients();
// showClientById(6);
// insertClient(new Client(0, '2023-02-03', 1, new PhysicalPerson(2), undefined));
// updateClient(new Client(3, '2023-02-01', 1, new PhysicalPerson(2), undefined));
deleteClient(5);
