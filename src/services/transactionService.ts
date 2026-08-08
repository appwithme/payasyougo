/** Local transaction helpers retired — records are created by the API. */
export default {
  createTransactionRecord() {
    throw new Error('Use payments API — local transactionService is retired');
  },
};
