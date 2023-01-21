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
    '(22) 2222-2222',
    '(22) 22222-2222',
    'teste@email.com',
    new Address(2),
  );
  await Database.instance.open();
  await Database.instance.beginTransaction();
  const result = await contact.save();
  await Database.instance.commit();
  await Database.instance.close();

  console.log(result);
};

showContacts();
