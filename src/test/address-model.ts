import Address from '../model/Address';
import City from '../model/City';
import Database from '../util/database';

const address = new Address();

const showAddresses = async () => {
  await Database.instance.open();
  const addresses = await address.get();
  await Database.instance.close();
  if (addresses) {
    for (const address of addresses) {
      console.log(address);
    }
  }
};

const insertAddress = async () => {
  const address = new Address(
    0,
    'Rua Teste 1',
    111,
    'Teste',
    '',
    '11.100-000',
    new City(5183),
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await address.save();
  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();
  await Database.instance.close();

  console.log(result);
};

const updateAddress = async () => {
  await Database.instance?.open();
  Database.instance?.beginTransaction();
  const address = new Address(2, 'teste', 2, 'teste', '', '22.222-000', new City(5181));
  const result = await address.update();
  await Database.instance?.commit();
  await Database.instance?.close();
  console.log(result);
};

const deleteAddress = async () => {
  await Database.instance?.open();
  Database.instance?.beginTransaction();
  const address = new Address(6);
  const result = await address.delete();
  await Database.instance?.commit();
  await Database.instance?.close();
  console.log(result);
};

// insertAddress();
//updateAddress();
//deleteAddress();
showAddresses();
