/*
 * These are the simple collection of error messages for the 404 returns
 * so that if we need to edit them, or internationalize them, they are
 * defined in one place.
 */
const errorMessages = {
  adminNoBestProfession: 'Not enough data found for the given dates',
  notValidDateInQueryParams: 'No valid Dates in query parameters',
  noValidClientOrAmount: 'A valid client ID and amount must be provided',
  noValidContractId: 'A valid contract ID must be provided',
  noValidJobId: 'A valid job ID must be provided',
  notEnoughFunds: 'Not enough funds available in balance to pay this job',
  errorPayingJob: 'An unexpected error occurred when paying the job, transaction rollbacked',
  errorMakingDeposit: 'There was an error making the deposit. The transaction was rollback',
  profileNoContract: 'The current profile doesn\'t own that contract'
}

module.exports = {
  errorMessages,
}