import { useAuth } from '@/auth/auth.store';
import { useActiveGym } from '@/features/gyms/useActiveGym';

export const getCurrencySymbol = (currency?: string): string => {
  if (!currency) return '₦';
  const upper = currency.toUpperCase().trim();
  switch (upper) {
    case 'USD':
    case '$':
      return '$';
    case 'EUR':
    case '€':
      return '€';
    case 'GBP':
    case '£':
      return '£';
    case 'CAD':
      return 'CA$';
    case 'AUD':
      return 'AU$';
    case 'NGN':
    case 'NAIRA':
    case '₦':
      return '₦';
    case 'GHS':
    case 'GH₵':
      return 'GH₵';
    case 'KES':
    case 'KSH':
      return 'KSh';
    case 'ZAR':
    case 'R':
      return 'R';
    default:
      return currency.length <= 3 ? currency : '₦';
  }
};

export const formatCurrency = (
  amount: number | string | null | undefined,
  currencySymbolOrCode: string = '₦'
): string => {
  if (amount === null || amount === undefined || amount === '') {
    return `${getCurrencySymbol(currencySymbolOrCode)}0.00`;
  }
  const numeric = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount;
  if (isNaN(numeric)) {
    return `${getCurrencySymbol(currencySymbolOrCode)}0.00`;
  }
  const symbol = getCurrencySymbol(currencySymbolOrCode);
  return `${symbol}${numeric.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const useCurrency = () => {
  const { user } = useAuth();
  const { gym } = useActiveGym();

  const isSuperAdmin = user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return {
      currency: 'NGN',
      symbol: '₦',
      format: (amount: number | string | null | undefined) => formatCurrency(amount, '₦'),
    };
  }

  const configuredCurrency = gym?.currency || 'NGN';
  const symbol = getCurrencySymbol(configuredCurrency);

  return {
    currency: configuredCurrency,
    symbol,
    format: (amount: number | string | null | undefined) => formatCurrency(amount, symbol),
  };
};
