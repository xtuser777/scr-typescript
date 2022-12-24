import Contact from './Contact';

export default class PhysicalPerson {
  private _id: number;
  private _name: string;
  private _rg: string;
  private _cpf: string;
  private _birthDate: Date;
  private _contact: Contact;

  constructor(
    id = 0,
    name = '',
    rg = '',
    cpf = '',
    birthDate = new Date(),
    contact = new Contact(),
  ) {
    this._id = id;
    this._name = name;
    this._rg = rg;
    this._cpf = cpf;
    this._birthDate = birthDate;
    this._contact = contact;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rg(): string {
    return this._rg;
  }

  get cpf(): string {
    return this._cpf;
  }

  get birthDate(): Date {
    return this._birthDate;
  }

  get contact(): Contact {
    return this._contact;
  }

  validateCpf(cpf: string): boolean {
    if (cpf === '') return false;

    cpf = cpf.replaceAll('.', '');
    cpf = cpf.replace('-', '');

    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false;

    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) {
      add += Number(cpf[i]) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf[9])) {
      return false;
    }

    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) {
      add += Number(cpf[i]) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf[10])) {
      return false;
    }

    return true;
  }
}
