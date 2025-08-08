const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const Razorpay = require('razorpay');

// Initialize Plaid
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class BankingService {
  // Link bank account via Plaid
  async linkBankAccount(publicToken, userId) {
    try {
      const response = await plaidClient.linkTokenExchange({
        public_token: publicToken,
      });
      
      const accessToken = response.data.access_token;
      
      // Store access token securely (encrypt in production)
      await User.findByIdAndUpdate(userId, {
        plaidAccessToken: accessToken,
        bankAccountLinked: true
      });
      
      return { success: true, accessToken };
    } catch (error) {
      console.error('Bank linking error:', error);
      throw new Error('Failed to link bank account');
    }
  }
  
  // Get account balances
  async getAccountBalances(accessToken) {
    try {
      const response = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      
      return response.data.accounts.map(account => ({
        accountId: account.account_id,
        name: account.name,
        balance: account.balances.current,
        type: account.type,
        subtype: account.subtype
      }));
    } catch (error) {
      console.error('Balance fetch error:', error);
      throw new Error('Failed to fetch account balances');
    }
  }
  
  // Get transactions for round-up calculation
  async getTransactions(accessToken, startDate, endDate) {
    try {
      const response = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });
      
      return response.data.transactions.map(transaction => ({
        transactionId: transaction.transaction_id,
        accountId: transaction.account_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        category: transaction.category[0],
        subcategory: transaction.category[1] || null
      }));
    } catch (error) {
      console.error('Transactions fetch error:', error);
      throw new Error('Failed to fetch transactions');
    }
  }
  
  // Process payment via Razorpay
  async processPayment(amount, currency, userId) {
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: currency,
        receipt: `investment_${userId}_${Date.now()}`,
      });
      
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Failed to process payment');
    }
  }
}

module.exports = new BankingService();
