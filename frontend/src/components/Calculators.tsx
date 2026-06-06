import React, { useState } from 'react';
import { Percent, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mortgage' | 'emi' | 'roi'>('mortgage');

  // Mortgage Calculator state
  const [homeValue, setHomeValue] = useState(1200000);
  const [downPayment, setDownPayment] = useState(240000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.2); // annual %
  const [homeInsurance, setHomeInsurance] = useState(1200); // annual $

  // EMI Calculator state
  const [emiPrincipal, setEmiPrincipal] = useState(500000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(15); // years

  // ROI Calculator state
  const [purchasePrice, setPurchasePrice] = useState(800000);
  const [monthlyRent, setMonthlyRent] = useState(4500);
  const [operatingExpenses, setOperatingExpenses] = useState(1200); // monthly

  // Mortgage Calculation
  const calculateMortgage = () => {
    const principal = homeValue - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    let monthlyPrincipalInterest = 0;
    if (monthlyRate > 0) {
      monthlyPrincipalInterest =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPrincipalInterest = principal / totalPayments;
    }

    const monthlyTax = (homeValue * (propertyTax / 100)) / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthly = monthlyPrincipalInterest + monthlyTax + monthlyInsurance;

    return {
      principalInterest: Math.round(monthlyPrincipalInterest),
      tax: Math.round(monthlyTax),
      insurance: Math.round(monthlyInsurance),
      total: Math.round(totalMonthly),
    };
  };

  // EMI Calculation
  const calculateEMI = () => {
    const P = emiPrincipal;
    const r = emiRate / 12 / 100;
    const n = emiTenure * 12;
    let emi = 0;
    if (r > 0) {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = P / n;
    }
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  // ROI Calculation
  const calculateROI = () => {
    const annualRent = monthlyRent * 12;
    const annualExpenses = operatingExpenses * 12;
    const netOperatingIncome = annualRent - annualExpenses;
    const capitalizationRate = (netOperatingIncome / purchasePrice) * 100;
    const annualCashFlow = netOperatingIncome;
    const cashOnCashROI = (annualCashFlow / (purchasePrice * 0.2)) * 100; // Assumes 20% downpayment

    return {
      noi: Math.round(netOperatingIncome),
      capRate: capitalizationRate.toFixed(2),
      cashFlow: Math.round(annualCashFlow),
      roi: cashOnCashROI.toFixed(2),
    };
  };

  const mortgageResult = calculateMortgage();
  const emiResult = calculateEMI();
  const roiResult = calculateROI();

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-sm">
      {/* Tab Selectors */}
      <div className="flex border-b border-outline-variant/20 mb-6">
        <button
          onClick={() => setActiveTab('mortgage')}
          className={`flex-1 pb-3 text-center font-label-md text-label-md tracking-wider transition-all border-b-2 ${
            activeTab === 'mortgage'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          MORTGAGE CALCULATOR
        </button>
        <button
          onClick={() => setActiveTab('emi')}
          className={`flex-1 pb-3 text-center font-label-md text-label-md tracking-wider transition-all border-b-2 ${
            activeTab === 'emi'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          EMI CALCULATOR
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`flex-1 pb-3 text-center font-label-md text-label-md tracking-wider transition-all border-b-2 ${
            activeTab === 'roi'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          INVESTMENT ROI
        </button>
      </div>

      {/* Mortgage Calculator Form */}
      {activeTab === 'mortgage' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-on-surface-variant font-medium">Home Value</label>
                <span className="text-primary font-bold">${homeValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={homeValue}
                onChange={(e) => setHomeValue(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-on-surface-variant font-medium">Down Payment</label>
                <span className="text-primary font-bold">
                  ${downPayment.toLocaleString()} ({Math.round((downPayment / homeValue) * 100)}%)
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max={homeValue}
                step="10000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg py-2.5 px-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface dark:bg-surface-container-high"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Loan Term (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg py-2.5 px-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface dark:bg-surface-container-high"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-highest/50 p-6 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-4">
                Estimated Monthly Payment
              </h4>
              <div className="text-primary font-headline-xl text-headline-xl mb-6">
                ${mortgageResult.total.toLocaleString()}
                <span className="text-sm font-normal text-on-surface-variant"> /mo</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Principal & Interest</span>
                  <span className="font-semibold text-on-surface">
                    ${mortgageResult.principalInterest.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Property Taxes</span>
                  <span className="font-semibold text-on-surface">
                    ${mortgageResult.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Home Insurance</span>
                  <span className="font-semibold text-on-surface">
                    ${mortgageResult.insurance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md mt-6 hover:opacity-90 active:scale-95 transition-all">
              Apply For Mortgage
            </button>
          </div>
        </div>
      )}

      {/* EMI Calculator Form */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-on-surface-variant font-medium">Loan Amount</label>
                <span className="text-primary font-bold">${emiPrincipal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="20"
                    value={emiRate}
                    onChange={(e) => setEmiRate(Number(e.target.value))}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg py-2.5 px-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface dark:bg-surface-container-high"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Tenure (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Number(e.target.value))}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg py-2.5 px-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface dark:bg-surface-container-high"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-highest/50 p-6 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-4">
                Monthly EMI Installment
              </h4>
              <div className="text-primary font-headline-xl text-headline-xl mb-6">
                ${emiResult.monthlyEMI.toLocaleString()}
                <span className="text-sm font-normal text-on-surface-variant"> /mo</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Principal Amount</span>
                  <span className="font-semibold text-on-surface">
                    ${emiPrincipal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Total Interest</span>
                  <span className="font-semibold text-on-surface">
                    ${emiResult.totalInterest.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Total Payable</span>
                  <span className="font-semibold text-on-surface">
                    ${emiResult.totalPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md mt-6 hover:opacity-90 active:scale-95 transition-all">
              Request Loan Approval
            </button>
          </div>
        </div>
      )}

      {/* ROI Calculator Form */}
      {activeTab === 'roi' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-on-surface-variant font-medium">Purchase Price</label>
                <span className="text-primary font-bold">${purchasePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="3000000"
                step="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Expected Monthly Rent
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    type="number"
                    min="500"
                    max="30000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg py-2.5 pl-9 pr-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface dark:bg-surface-container-high"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Monthly Expenses (Tax, Ins, Maint)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg py-2.5 pl-9 pr-4 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface dark:bg-surface-container-high"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-highest/50 p-6 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-4">
                Cap Rate & Estimated Return
              </h4>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-primary font-headline-xl text-headline-xl">
                  {roiResult.capRate}%
                </span>
                <span className="text-sm font-normal text-on-surface-variant"> Cap Rate</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Annual Net Income</span>
                  <span className="font-semibold text-on-surface">
                    ${roiResult.noi.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Annual Cash Flow</span>
                  <span className="font-semibold text-on-surface">
                    ${roiResult.cashFlow.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Est. Cash-on-Cash ROI</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {roiResult.roi}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 p-3 bg-primary-container/10 text-primary border border-primary/20 rounded-lg text-xs font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>ROI Assumes a 20% downpayment on acquisitions.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculators;
