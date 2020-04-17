import { resolveConfig } from 'prettier';
import { response } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: RequestDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw Error('Transaction type is invalide');
    }
    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0) {
      throw Error('This transaction not completed');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
