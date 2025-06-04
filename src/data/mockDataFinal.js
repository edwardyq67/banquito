export const initialUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'arteaga', password: 'arteaga123', role: 'member', name: 'Arteaga', memberId: 1 },
  { id: 3, username: 'rossi', password: 'rossi123', role: 'member', name: 'Rossi', memberId: 2 },
  { id: 4, username: 'yangali', password: 'yangali123', role: 'member', name: 'Yangali', memberId: 3 },
  { id: 5, username: 'daniel', password: 'daniel123', role: 'member', name: 'Daniel', memberId: 4 },
  { id: 6, username: 'leandro', password: 'leandro123', role: 'member', name: 'Leandro', memberId: 5 },
  { id: 7, username: 'externo1', password: 'ext123', role: 'external', name: 'Cliente Externo 1' }
];

export const initialMembersData = [
  { id: 1, name: 'Arteaga', dni: '12345678', shares: 20, guarantee: 10000, creditRating: 'green', creditScore: 78, phone: '987654321', email: 'arteaga@email.com' },
  { id: 2, name: 'Rossi', dni: '23456789', shares: 18, guarantee: 9000, creditRating: 'green', creditScore: 82, phone: '987654322', email: 'rossi@email.com' },
  { id: 3, name: 'Yangali', dni: '34567890', shares: 22, guarantee: 11000, creditRating: 'yellow', creditScore: 45, phone: '987654323', email: 'yangali@email.com' },
  { id: 4, name: 'Daniel', dni: '45678901', shares: 15, guarantee: 7500, creditRating: 'green', creditScore: 67, phone: '987654324', email: 'daniel@email.com' },
  { id: 5, name: 'Leandro', dni: '56789012', shares: 25, guarantee: 12500, creditRating: 'red', creditScore: 22, phone: '987654325', email: 'leandro@email.com' },
  { id: 6, name: 'Joel', dni: '67890123', shares: 16, guarantee: 8000, creditRating: 'green', creditScore: 71, phone: '987654326', email: 'joel@email.com' },
  { id: 7, name: 'Lescano', dni: '78901234', shares: 19, guarantee: 9500, creditRating: 'yellow', creditScore: 52, phone: '987654327', email: 'lescano@email.com' },
  { id: 8, name: 'Julia', dni: '89012345', shares: 21, guarantee: 10500, creditRating: 'green', creditScore: 85, phone: '987654328', email: 'julia@email.com' },
  { id: 9, name: 'Club Juventud', dni: '90123456', shares: 30, guarantee: 15000, creditRating: 'green', creditScore: 89, phone: '987654329', email: 'club@email.com' },
  { id: 10, name: 'Ito', dni: '01234567', shares: 17, guarantee: 8500, creditRating: 'yellow', creditScore: 38, phone: '987654330', email: 'ito@email.com' },
  { id: 11, name: 'Alexander', dni: '11223344', shares: 23, guarantee: 11500, creditRating: 'green', creditScore: 76, phone: '987654331', email: 'alexander@email.com' },
  { id: 12, name: 'Yovana', dni: '22334455', shares: 14, guarantee: 7000, creditRating: 'red', creditScore: 18, phone: '987654332', email: 'yovana@email.com' },
  { id: 13, name: 'Cope', dni: '33445566', shares: 20, guarantee: 10000, creditRating: 'green', creditScore: 73, phone: '987654333', email: 'cope@email.com' },
  { id: 14, name: 'Torres', dni: '44556677', shares: 18, guarantee: 9000, creditRating: 'yellow', creditScore: 41, phone: '987654334', email: 'torres@email.com' },
  { id: 15, name: 'Rusbel', dni: '55667788', shares: 26, guarantee: 13000, creditRating: 'green', creditScore: 87, phone: '987654335', email: 'rusbel@email.com' },
  { id: 16, name: 'Palacios', dni: '66778899', shares: 15, guarantee: 7500, creditRating: 'green', creditScore: 64, phone: '987654336', email: 'palacios@email.com' },
  { id: 17, name: 'T.Lujan', dni: '77889900', shares: 19, guarantee: 9500, creditRating: 'yellow', creditScore: 49, phone: '987654337', email: 'tlujan@email.com' },
  { id: 18, name: 'Godofredo', dni: '88990011', shares: 22, guarantee: 11000, creditRating: 'green', creditScore: 79, phone: '987654338', email: 'godofredo@email.com' },
  { id: 19, name: 'Joel Diana', dni: '99001122', shares: 16, guarantee: 8000, creditRating: 'red', creditScore: 25, phone: '987654339', email: 'joeldiana@email.com' },
  { id: 20, name: 'Chambi', dni: '10203040', shares: 24, guarantee: 12000, creditRating: 'green', creditScore: 83, phone: '987654340', email: 'chambi@email.com' },
  { id: 21, name: 'Gastón', dni: '20304050', shares: 18, guarantee: 9000, creditRating: 'yellow', creditScore: 56, phone: '987654341', email: 'gaston@email.com' },
  { id: 22, name: 'M.Sanchez', dni: '30405060', shares: 20, guarantee: 10000, creditRating: 'green', creditScore: 69, phone: '987654342', email: 'msanchez@email.com' },
  { id: 23, name: 'Miguel', dni: '40506070', shares: 17, guarantee: 8500, creditRating: 'green', creditScore: 72, phone: '987654343', email: 'miguel@email.com' },
  { id: 24, name: 'Evanovich', dni: '50607080', shares: 21, guarantee: 10500, creditRating: 'yellow', creditScore: 44, phone: '987654344', email: 'evanovich@email.com' },
  { id: 25, name: 'Gabino', dni: '60708090', shares: 15, guarantee: 7500, creditRating: 'red', creditScore: 15, phone: '987654345', email: 'gabino@email.com' },
  { id: 26, name: 'Pepe', dni: '70809001', shares: 19, guarantee: 9500, creditRating: 'green', creditScore: 68, phone: '987654346', email: 'pepe@email.com' },
  { id: 27, name: 'Tito', dni: '80900112', shares: 23, guarantee: 11500, creditRating: 'green', creditScore: 81, phone: '987654347', email: 'tito@email.com' },
  { id: 28, name: 'Guando', dni: '90011223', shares: 16, guarantee: 8000, creditRating: 'yellow', creditScore: 33, phone: '987654348', email: 'guando@email.com' },
  { id: 29, name: 'Victor', dni: '11223300', shares: 25, guarantee: 12500, creditRating: 'green', creditScore: 86, phone: '987654349', email: 'victor@email.com' },
  { id: 30, name: 'Jack', dni: '22334411', shares: 14, guarantee: 7000, creditRating: 'red', creditScore: 12, phone: '987654350', email: 'jack@email.com' },
  { id: 31, name: 'Charapa', dni: '33445522', shares: 22, guarantee: 11000, creditRating: 'green', creditScore: 74, phone: '987654351', email: 'charapa@email.com' },
  { id: 32, name: 'J.C', dni: '44556633', shares: 18, guarantee: 9000, creditRating: 'yellow', creditScore: 47, phone: '987654352', email: 'jc@email.com' },
  { id: 33, name: 'Pochin', dni: '55667744', shares: 20, guarantee: 10000, creditRating: 'green', creditScore: 77, phone: '987654353', email: 'pochin@email.com' },
  { id: 34, name: 'Zapata', dni: '66778855', shares: 17, guarantee: 8500, creditRating: 'green', creditScore: 66, phone: '987654354', email: 'zapata@email.com' },
  { id: 35, name: 'Dani', dni: '77889966', shares: 24, guarantee: 12000, creditRating: 'yellow', creditScore: 58, phone: '987654355', email: 'dani@email.com' },
  { id: 36, name: 'Abel', dni: '88990077', shares: 16, guarantee: 8000, creditRating: 'red', creditScore: 8, phone: '987654356', email: 'abel@email.com' },
  { id: 37, name: 'Hiromi', dni: '99001188', shares: 21, guarantee: 10500, creditRating: 'green', creditScore: 75, phone: '987654357', email: 'hiromi@email.com' },
  { id: 38, name: 'Alex', dni: '10111299', shares: 19, guarantee: 9500, creditRating: 'green', creditScore: 70, phone: '987654358', email: 'alex@email.com' },
  { id: 39, name: 'Oldary', dni: '21223300', shares: 15, guarantee: 7500, creditRating: 'yellow', creditScore: 42, phone: '987654359', email: 'oldary@email.com' },
  { id: 40, name: 'Diana', dni: '32334411', shares: 23, guarantee: 11500, creditRating: 'green', creditScore: 84, phone: '987654360', email: 'diana@email.com' }
];

// Agregar plan de ahorro a todos los socios
export const membersWithSavings = initialMembersData.map((member) => ({
  ...member,
  savingsPlan: {
    enabled: true,
    planDays: 180, // Por defecto 6 meses
    startDate: '2024-01-01',
    TEA: 0.02 // 2% TEA
  }
}));

// Función para determinar la calificación crediticia basada en el puntaje
export const getCreditRatingFromScore = (creditScore) => {
  if (creditScore >= 61 && creditScore <= 90) return 'green';
  if (creditScore >= 31 && creditScore <= 60) return 'yellow';
  if (creditScore >= 1 && creditScore <= 30) return 'red';
  return 'red';
};

// Función para obtener el texto descriptivo del puntaje
export const getCreditScoreDescription = (creditScore) => {
  if (creditScore >= 61 && creditScore <= 90) return 'Excelente';
  if (creditScore >= 31 && creditScore <= 60) return 'Regular';
  if (creditScore >= 1 && creditScore <= 30) return 'Riesgo Alto';
  return 'Sin Calificar';
};

// Función para encontrar el próximo miércoles desde una fecha dada
const getNextWednesday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const daysUntilWednesday = (3 - day + 7) % 7;
  if (daysUntilWednesday === 0 && d.getDay() === 3) {
    return d;
  }
  d.setDate(d.getDate() + (daysUntilWednesday === 0 ? 7 : daysUntilWednesday));
  return d;
};

// SISTEMA DE CÁLCULO: Pagos semanales con interés mensual
export const calculateLoanPayment = (amount, monthlyInterestRate, totalWeeks) => {
  // Distribución del capital en pagos semanales
  const weeklyCapital = amount / totalWeeks;
  
  // El interés mensual se aplica por cada mes del préstamo
  const totalMonths = Math.ceil(totalWeeks / 4);
  const totalInterest = amount * (monthlyInterestRate / 100) * totalMonths;
  
  // Pago semanal total (redondeado hacia arriba)
  const weeklyPayment = (amount + totalInterest) / totalWeeks;
  
  return {
    weeklyPayment: Math.ceil(weeklyPayment),
    weeklyCapital: Math.round(weeklyCapital * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round((amount + totalInterest) * 100) / 100,
    totalMonths: totalMonths
  };
};

// Préstamos activos con nueva lógica
export const initialLoans = [
  // Préstamo 1: Arteaga - S/ 5,000 a 20 semanas (5 meses) - 3% mensual
  {
    id: 1,
    memberId: 1,
    memberName: 'Arteaga',
    originalAmount: 5000,
    remainingAmount: 3750, // 15 semanas completadas
    totalWeeks: 20,
    currentWeek: 5,
    monthlyInterestRate: 3,
    weeklyPayment: 325, // Math.ceil((5000 + 750) / 20) = 288
    dueDate: '2025-05-28',
    status: 'current',
    startDate: '2025-01-01',
    paymentHistory: [
      { date: '2025-01-08', amount: 325, type: 'weekly' },
      { date: '2025-01-15', amount: 325, type: 'weekly' },
      { date: '2025-01-22', amount: 325, type: 'weekly' },
      { date: '2025-01-29', amount: 325, type: 'weekly' }
    ]
  },
  
  // Préstamo 2: Yangali - S/ 3,000 a 12 semanas (3 meses) - 5% mensual  
  {
    id: 2,
    memberId: 3,
    memberName: 'Yangali',
    originalAmount: 3000,
    remainingAmount: 2000, // 8 semanas completadas
    totalWeeks: 12,
    currentWeek: 4,
    monthlyInterestRate: 5,
    weeklyPayment: 288, // Math.ceil((3000 + 450) / 12) = 288
    dueDate: '2025-05-14',
    status: 'overdue',
    startDate: '2025-03-01',
    paymentHistory: [
      { date: '2025-03-05', amount: 288, type: 'weekly' },
      { date: '2025-03-12', amount: 288, type: 'weekly' },
      { date: '2025-03-19', amount: 288, type: 'weekly' }
    ]
  },
  
  // Préstamo 3: Leandro - S/ 800 a 8 semanas (2 meses) - 10% mensual
  {
    id: 3,
    memberId: 5,
    memberName: 'Leandro',
    originalAmount: 800,
    remainingAmount: 400, // 4 semanas completadas
    totalWeeks: 8,
    currentWeek: 4,
    monthlyInterestRate: 10,
    weeklyPayment: 125, // Math.ceil((800 + 160) / 8) = 120
    dueDate: '2025-04-16',
    status: 'overdue',
    startDate: '2025-02-01',
    paymentHistory: [
      { date: '2025-02-05', amount: 125, type: 'weekly' },
      { date: '2025-02-12', amount: 125, type: 'weekly' },
      { date: '2025-02-19', amount: 125, type: 'weekly' }
    ]
  },
  
  // Préstamo 4: Rusbel - S/ 7,000 a 32 semanas (8 meses) - 3% mensual
  {
    id: 4,
    memberId: 15,
    memberName: 'Rusbel',
    originalAmount: 7000,
    remainingAmount: 5250, // 16 semanas completadas
    totalWeeks: 32,
    currentWeek: 8,
    monthlyInterestRate: 3,
    weeklyPayment: 287, // Math.ceil((7000 + 1680) / 32) = 272
    dueDate: '2025-05-28',
    status: 'current',
    startDate: '2024-12-01',
    paymentHistory: [
      { date: '2024-12-04', amount: 287, type: 'weekly' },
      { date: '2024-12-11', amount: 287, type: 'weekly' },
      { date: '2024-12-18', amount: 287, type: 'weekly' },
      { date: '2024-12-25', amount: 287, type: 'weekly' },
      { date: '2025-01-01', amount: 287, type: 'weekly' },
      { date: '2025-01-08', amount: 287, type: 'weekly' },
      { date: '2025-01-15', amount: 287, type: 'weekly' }
    ]
  },
  
  // Préstamo 5: Chambi - S/ 1,200 a 16 semanas (4 meses) - 5% mensual
  {
    id: 5,
    memberId: 20,
    memberName: 'Chambi',
    originalAmount: 1200,
    remainingAmount: 900, // 4 semanas completadas
    totalWeeks: 16,
    currentWeek: 4,
    monthlyInterestRate: 5,
    weeklyPayment: 90, // Math.ceil((1200 + 240) / 16) = 90
    dueDate: '2025-05-28',
    status: 'current',
    startDate: '2025-04-01',
    paymentHistory: [
      { date: '2025-04-02', amount: 90, type: 'weekly' },
      { date: '2025-04-09', amount: 90, type: 'weekly' },
      { date: '2025-04-16', amount: 90, type: 'weekly' }
    ]
  },
  
  // Préstamo 6: Rossi - S/ 4,500 a 24 semanas (6 meses) - 5% mensual
  {
    id: 6,
    memberId: 2,
    memberName: 'Rossi',
    originalAmount: 4500,
    remainingAmount: 3375, // 8 semanas completadas
    totalWeeks: 24,
    currentWeek: 6,
    monthlyInterestRate: 5,
    weeklyPayment: 219, // Math.ceil((4500 + 1350) / 24) = 244
    dueDate: '2025-06-04',
    status: 'current',
    startDate: '2025-01-01',
    paymentHistory: [
      { date: '2025-01-08', amount: 219, type: 'weekly' },
      { date: '2025-01-15', amount: 219, type: 'weekly' },
      { date: '2025-01-22', amount: 219, type: 'weekly' },
      { date: '2025-01-29', amount: 219, type: 'weekly' },
      { date: '2025-02-05', amount: 219, type: 'weekly' }
    ]
  },
  
  // Préstamo 7: Joel - S/ 2,500 a 12 semanas (3 meses) - 5% mensual
  {
    id: 7,
    memberId: 6,
    memberName: 'Joel',
    originalAmount: 2500,
    remainingAmount: 1875, // 3 semanas completadas
    totalWeeks: 12,
    currentWeek: 3,
    monthlyInterestRate: 5,
    weeklyPayment: 240, // Math.ceil((2500 + 375) / 12) = 240
    dueDate: '2025-05-21',
    status: 'current',
    startDate: '2025-04-01',
    paymentHistory: [
      { date: '2025-04-02', amount: 240, type: 'weekly' },
      { date: '2025-04-09', amount: 240, type: 'weekly' }
    ]
  },
  
  // Préstamo 8: Julia - S/ 6,000 a 36 semanas (9 meses) - 3% mensual
  {
    id: 8,
    memberId: 8,
    memberName: 'Julia',
    originalAmount: 6000,
    remainingAmount: 5000, // 8 semanas completadas
    totalWeeks: 36,
    currentWeek: 8,
    monthlyInterestRate: 3,
    weeklyPayment: 217, // Math.ceil((6000 + 1620) / 36) = 212
    dueDate: '2025-06-11',
    status: 'current',
    startDate: '2024-11-01',
    paymentHistory: [
      { date: '2024-11-06', amount: 217, type: 'weekly' },
      { date: '2024-11-13', amount: 217, type: 'weekly' },
      { date: '2024-11-20', amount: 217, type: 'weekly' },
      { date: '2024-11-27', amount: 217, type: 'weekly' },
      { date: '2024-12-04', amount: 217, type: 'weekly' },
      { date: '2024-12-11', amount: 217, type: 'weekly' },
      { date: '2024-12-18', amount: 217, type: 'weekly' }
    ]
  }
];

// Solicitudes de préstamo
export const initialLoanRequests = [
  {
    id: 1,
    memberId: 4,
    memberName: 'Daniel',
    amount: 2500,
    totalWeeks: 20,
    purpose: 'Capital de trabajo para negocio',
    requestDate: '2025-05-14',
    requiredDate: '2025-05-30',
    status: 'pending',
    monthlyInterestRate: 5,
    monthlyIncome: 3500,
    otherDebts: 800,
    guaranteeOffered: 7500,
    comments: 'Solicita préstamo para ampliar su negocio de venta de repuestos',
    documents: ['dni', 'income_proof', 'business_license']
  },
  {
    id: 2,
    memberId: 7,
    memberName: 'Lescano',
    amount: 4000,
    totalWeeks: 28,
    purpose: 'Mejoras en vivienda',
    requestDate: '2025-05-21',
    requiredDate: '2025-06-15',
    status: 'approved',
    monthlyInterestRate: 3,
    monthlyIncome: 4200,
    otherDebts: 1200,
    guaranteeOffered: 9500,
    comments: 'Aprobado por buen historial crediticio y garantía suficiente',
    documents: ['dni', 'income_proof', 'property_deed'],
    approvedDate: '2025-05-21',
    approvedBy: 'admin',
    weeklyPayment: 188 // Math.ceil((4000 + 840) / 28)
  },
  {
    id: 3,
    memberId: 10,
    memberName: 'Ito',
    amount: 1800,
    totalWeeks: 16,
    purpose: 'Gastos médicos familiares',
    requestDate: '2025-05-07',
    requiredDate: '2025-05-28',
    status: 'rejected',
    monthlyInterestRate: 5,
    monthlyIncome: 2500,
    otherDebts: 1500,
    guaranteeOffered: 8500,
    comments: 'Rechazado por alta carga de deudas existentes',
    documents: ['dni', 'medical_bills'],
    rejectedDate: '2025-05-14',
    rejectedBy: 'admin',
    rejectionReason: 'Capacidad de pago insuficiente debido a alta carga de deudas existentes'
  },
  {
    id: 4,
    memberId: 1,
    memberName: 'Arteaga',
    amount: 3500,
    totalWeeks: 24,
    purpose: 'Renovación de equipo de trabajo',
    requestDate: '2025-05-20',
    requiredDate: '2025-06-05',
    status: 'pending',
    monthlyInterestRate: 5,
    monthlyIncome: 4000,
    otherDebts: 500,
    guaranteeOffered: 10000,
    comments: 'Solicita préstamo para renovar equipos de su taller mecánico',
    documents: ['dni', 'income_proof', 'business_license']
  },
  {
    id: 5,
    memberId: 2,
    memberName: 'Rossi',
    amount: 1500,
    totalWeeks: 12,
    purpose: 'Curso de capacitación profesional',
    requestDate: '2025-05-22',
    requiredDate: '2025-06-10',
    status: 'approved',
    monthlyInterestRate: 5,
    monthlyIncome: 3200,
    otherDebts: 300,
    guaranteeOffered: 9000,
    comments: 'Aprobado para curso de especialización contable',
    documents: ['dni', 'income_proof', 'course_invoice'],
    approvedDate: '2025-05-23',
    approvedBy: 'admin',
    weeklyPayment: 143
  },
  {
    id: 6,
    memberId: 11,
    memberName: 'Alexander',
    amount: 5000,
    totalWeeks: 32,
    purpose: 'Compra de vehículo de trabajo',
    requestDate: '2025-05-18',
    requiredDate: '2025-06-08',
    status: 'pending',
    monthlyInterestRate: 3,
    monthlyIncome: 5000,
    otherDebts: 1000,
    guaranteeOffered: 11500,
    comments: 'Necesita vehículo para ampliar servicio de delivery',
    documents: ['dni', 'income_proof', 'vehicle_quote']
  },
  {
    id: 7,
    memberId: 13,
    memberName: 'Cope',
    amount: 2800,
    totalWeeks: 20,
    purpose: 'Stock de mercadería',
    requestDate: '2025-05-19',
    requiredDate: '2025-06-12',
    status: 'pending',
    monthlyInterestRate: 5,
    monthlyIncome: 3800,
    otherDebts: 600,
    guaranteeOffered: 10000,
    comments: 'Para comprar mercadería de temporada alta',
    documents: ['dni', 'income_proof', 'supplier_invoice']
  },
  {
    id: 8,
    memberId: 15,
    memberName: 'Rusbel',
    amount: 1200,
    totalWeeks: 8,
    purpose: 'Reparación de maquinaria',
    requestDate: '2025-05-24',
    requiredDate: '2025-06-02',
    status: 'approved',
    monthlyInterestRate: 10,
    monthlyIncome: 2800,
    otherDebts: 200,
    guaranteeOffered: 13000,
    comments: 'Aprobado para reparación urgente de maquinaria',
    documents: ['dni', 'repair_quote'],
    approvedDate: '2025-05-24',
    approvedBy: 'admin',
    weeklyPayment: 165
  },
  {
    id: 9,
    memberId: 20,
    memberName: 'Chambi',
    amount: 3000,
    totalWeeks: 24,
    purpose: 'Ampliación de local comercial',
    requestDate: '2025-05-16',
    requiredDate: '2025-06-01',
    status: 'pending',
    monthlyInterestRate: 5,
    monthlyIncome: 4500,
    otherDebts: 800,
    guaranteeOffered: 12000,
    comments: 'Para ampliar su tienda de abarrotes',
    documents: ['dni', 'income_proof', 'construction_quote']
  },
  {
    id: 10,
    memberId: 27,
    memberName: 'Tito',
    amount: 2200,
    totalWeeks: 16,
    purpose: 'Equipo de cómputo',
    requestDate: '2025-05-25',
    requiredDate: '2025-06-15',
    status: 'pending',
    monthlyInterestRate: 5,
    monthlyIncome: 3600,
    otherDebts: 400,
    guaranteeOffered: 11500,
    comments: 'Para modernizar su oficina de servicios contables',
    documents: ['dni', 'income_proof', 'equipment_quote']
  },
  {
    id: 11,
    memberId: 18,
    memberName: 'Godofredo',
    amount: 1800,
    totalWeeks: 12,
    purpose: 'Capital de trabajo emergencia',
    requestDate: '2025-05-23',
    requiredDate: '2025-05-30',
    status: 'rejected',
    monthlyInterestRate: 5,
    monthlyIncome: 2200,
    otherDebts: 1800,
    guaranteeOffered: 11000,
    comments: 'Rechazado por sobreendeudamiento',
    documents: ['dni', 'income_proof'],
    rejectedDate: '2025-05-24',
    rejectedBy: 'admin',
    rejectionReason: 'Nivel de endeudamiento excede el 80% de ingresos mensuales'
  },
  {
    id: 12,
    memberId: 31,
    memberName: 'Charapa',
    amount: 4200,
    totalWeeks: 28,
    purpose: 'Inversión en negocio familiar',
    requestDate: '2025-05-17',
    requiredDate: '2025-06-05',
    status: 'pending',
    monthlyInterestRate: 3,
    monthlyIncome: 4800,
    otherDebts: 500,
    guaranteeOffered: 11000,
    comments: 'Para iniciar negocio de restaurante familiar',
    documents: ['dni', 'income_proof', 'business_plan', 'permits']
  }
];

export const generateMockPaymentSchedule = (loanAmount, totalWeeks, monthlyInterestRate, startDate) => {
  const calculation = calculateLoanPayment(loanAmount, monthlyInterestRate, totalWeeks);
  const schedule = [];
  let remainingBalance = loanAmount;
  let currentDate = new Date(startDate);
  
  for (let i = 1; i <= totalWeeks; i++) {
    // Siguiente miércoles
    currentDate.setDate(currentDate.getDate() + 7);
    const wednesdayDate = getNextWednesday(currentDate);
    
    remainingBalance -= calculation.weeklyCapital;
    
    schedule.push({
      week: i,
      dueDate: wednesdayDate.toISOString().split('T')[0],
      weeklyPayment: calculation.weeklyPayment,
      capitalPayment: calculation.weeklyCapital,
      interestPayment: (calculation.weeklyPayment - calculation.weeklyCapital),
      remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100),
      status: 'pending'
    });
    
    currentDate = new Date(wednesdayDate);
  }
  
  return schedule;
};