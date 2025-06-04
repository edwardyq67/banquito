import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { initialUsers, initialLoans, membersWithSavings, initialLoanRequests } from './data/mockDataFinal';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [loans, setLoans] = useState(initialLoans);
  const [members, setMembers] = useState(membersWithSavings);
  const [loanRequests, setLoanRequests] = useState(initialLoanRequests);
  const [settings, setSettings] = useState({
    shareValue: 500,
    loanLimits: {
      individual: 8000,
      guaranteePercentage: 80
    },
    monthlyInterestRates: {
      high: 3, // >5000 - 3% mensual
      medium: 5, // 1000-5000 - 5% mensual
      low: 10 // <1000 - 10% mensual
    },
    operationDay: 'wednesday',
    delinquencyRate: 5.0 // Tasa de recargo por mora única en porcentaje
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const calculateTotalCapital = () => {
    return members.reduce((total, member) => total + (member.shares * settings.shareValue), 0);
  };

  const calculateAvailableCapital = () => {
    const totalCapital = calculateTotalCapital();
    const loanedAmount = loans.reduce((total, loan) => total + loan.remainingAmount, 0);
    return totalCapital - loanedAmount;
  };

  const getMonthlyInterestRate = (amount) => {
    if (!settings.monthlyInterestRates) {
      // Fallback values if monthlyInterestRates is undefined
      if (amount > 5000) return 3;
      if (amount >= 1000) return 5;
      return 10;
    }
    if (amount > 5000) return settings.monthlyInterestRates.high;
    if (amount >= 1000) return settings.monthlyInterestRates.medium;
    return settings.monthlyInterestRates.low;
  };

  const calculateLateFee = (originalPayment, dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (today <= due) return 0; // No hay mora si no está vencido
    
    // Recargo único por mora (independiente de los días de atraso)
    const lateFee = originalPayment * (settings.delinquencyRate / 100);
    
    return Math.round(lateFee * 100) / 100;
  };

  const getPaymentWithLateFee = (loan) => {
    const weeklyPayment = loan.weeklyPayment || loan.monthlyPayment;
    const lateFee = calculateLateFee(weeklyPayment, loan.dueDate);
    const daysLate = lateFee > 0 ? Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
    return {
      originalPayment: weeklyPayment,
      lateFee: lateFee,
      totalPayment: weeklyPayment + lateFee,
      daysLate: daysLate,
      isOverdue: lateFee > 0
    };
  };

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header user={currentUser} onLogout={handleLogout} />
      <Dashboard 
        user={currentUser}
        loans={loans}
        setLoans={setLoans}
        members={members}
        setMembers={setMembers}
        loanRequests={loanRequests}
        setLoanRequests={setLoanRequests}
        settings={settings}
        setSettings={setSettings}
        calculateTotalCapital={calculateTotalCapital}
        calculateAvailableCapital={calculateAvailableCapital}
        getMonthlyInterestRate={getMonthlyInterestRate}
        calculateLateFee={calculateLateFee}
        getPaymentWithLateFee={getPaymentWithLateFee}
      />
    </div>
  );
}

export default App;