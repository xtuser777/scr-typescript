import Address from '../model/Address';
import Contact from '../model/Contact';
import Database from '../util/database';

const showContacts = async () => {
  const contact = new Contact();
  await Database.instance.open();
  const contacts = await contact.get();
  await Database.instance.close();

  for (const contact of contacts) {
    console.log(contact);
  }
};

const showContactsById = async () => {
  const contact = new Contact();
  await Database.instance.open();
  const contacts = await contact.get({ id: 1 });
  await Database.instance.close();

  for (const contact of contacts) {
    console.log(contact);
  }
};

const insertContact = async () => {
  const contact = new Contact(
    0,
    '(11) 1111-1111',
    '',
    'teste1@hotmail.com',
    new Address(3),
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();

  const result = await contact.save();

  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();

  await Database.instance.close();

  console.log(result);
};

const updateContact = async () => {
  const contact = new Contact(
    2,
    '(22) 2222-2222',
    '(22) 22222-2222',
    'teste2@email.com',
    new Address(2),
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();

  const result = await contact.update();

  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();

  await Database.instance.close();

  console.log(result);
};

const deleteContact = async () => {
  const contact = new Contact(
    2,
    '(22) 2222-2222',
    '(22) 22222-2222',
    'teste2@email.com',
    new Address(2),
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();

  const result = await contact.delete();

  if (result > 0) await Database.instance.commit();
  else await Database.instance.rollback();

  await Database.instance.close();

  console.log(result);
};

// insertContact();
showContacts();
