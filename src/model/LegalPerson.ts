import Contact from './Contact';

export default class LegalPerson {
  private _id: number;
  private _corporateName: string;
  private _fantasyName: string;
  private _cnpj: string;
  private _contact: Contact;

  constructor(
    id = 0,
    corporateName = '',
    fantasyName = '',
    cnpj = '',
    contact = new Contact(),
  ) {
    this._id = id;
    this._corporateName = corporateName;
    this._fantasyName = fantasyName;
    this._cnpj = cnpj;
    this._contact = contact;
  }

  get id(): number {
    return this._id;
  }

  get corporateName(): string {
    return this._corporateName;
  }

  get fantasyName(): string {
    return this._fantasyName;
  }

  get cnpj(): string {
    return this._cnpj;
  }

  get contact(): Contact {
    return this._contact;
  }

  validateCnpj(cnpj: string): boolean {
    cnpj = cnpj.replaceAll('.', '');
    cnpj = cnpj.replace('/', '');
    cnpj = cnpj.replace('-', '');

    if (cnpj === '') return false;

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999'
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado.toString()[0] !== digitos[0]) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado.toString()[0] !== digitos[1]) return false;

    return true;
  }
}
