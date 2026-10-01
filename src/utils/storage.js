import { isOverdue } from './dateUtils';

// Storage Keys
const KEYS = {
  BOOKS: 'nexus_books',
  MEMBERS: 'nexus_members',
  TRANSACTIONS: 'nexus_transactions',
  CURRENT_USER: 'nexus_current_user',
  NEXT_MEMBER_ID: 'nexus_next_member_id',
  SETTINGS: 'nexus_settings'
};

// Initial Librarian
export const INITIAL_LIBRARIAN = {
  id: '901020525',
  name: 'Sechaba Thoabala',
  role: 'Librarian',
  email: 'sechaba.thoabala@nexuslibrary.org',
  phone: '+266 5800 9010',
  status: 'Active',
  password: 'admin123'
};

// Initial Members
export const INITIAL_MEMBERS = [
  {
    id: '901020500',
    name: 'Mohapi Thoabala',
    email: 'mohapi.t@nexuslibrary.org',
    phone: '+266 5801 0500',
    address: 'P.O. Box 104, Maseru 100',
    registrationDate: '2026-01-10',
    status: 'Active'
  },
  {
    id: '901020501',
    name: 'Sello Thoabala',
    email: 'sello.t@nexuslibrary.org',
    phone: '+266 5801 0501',
    address: 'Thetsane West, Maseru',
    registrationDate: '2026-01-15',
    status: 'Active'
  },
  {
    id: '901020502',
    name: 'Tumelo Mabuti',
    email: 'tumelo.mabuti@nexuslibrary.org',
    phone: '+266 5801 0502',
    address: 'Roma University Campus',
    registrationDate: '2026-02-01',
    status: 'Active'
  },
  {
    id: '901020503',
    name: 'Tumelo Khutlang',
    email: 'tumelo.khutlang@nexuslibrary.org',
    phone: '+266 5801 0503',
    address: 'Berea Teyateyaneng',
    registrationDate: '2026-02-10',
    status: 'Active'
  },
  {
    id: '901020504',
    name: 'Ratile Thulo',
    email: 'ratile.thulo@nexuslibrary.org',
    phone: '+266 5801 0504',
    address: 'Leribe Hlotse',
    registrationDate: '2026-03-05',
    status: 'Active'
  },
  {
    id: '901020505',
    name: 'Thabo Pali',
    email: 'thabo.pali@nexuslibrary.org',
    phone: '+266 5801 0505',
    address: 'Maseru West Sector 4',
    registrationDate: '2026-03-12',
    status: 'Active'
  }
];

// Initial 20 Realistic Books
export const INITIAL_BOOKS = [
  {
    id: 'BK-101',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    quantity: 4,
    description: 'A comprehensive handbook on writing clean, maintainable, and agile code.'
  },
  {
    id: 'BK-102',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category: 'Computer Science',
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    quantity: 3,
    description: 'The key principles and architecture behind modern data systems.'
  },
  {
    id: 'BK-103',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    isbn: '978-0135957059',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    publicationYear: 2019,
    quantity: 3,
    description: 'Your journey to mastery in modern software engineering craftsmanship.'
  },
  {
    id: 'BK-104',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson & Gerald Jay Sussman',
    isbn: '978-0262510875',
    category: 'Computer Science',
    publisher: 'MIT Press',
    publicationYear: 1996,
    quantity: 2,
    description: 'Foundational computer science textbook covering fundamental programming abstraction.'
  },
  {
    id: 'BK-105',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Thomas H. Cormen et al.',
    isbn: '978-0262046305',
    category: 'Computer Science',
    publisher: 'MIT Press',
    publicationYear: 2022,
    quantity: 3,
    description: 'Comprehensive guide and definitive reference for algorithm design and analysis.'
  },
  {
    id: 'BK-106',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    isbn: '978-0134757599',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    publicationYear: 2018,
    quantity: 2,
    description: 'Guide to restructuring code safely without changing external behavior.'
  },
  {
    id: 'BK-107',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma et al. (Gang of Four)',
    isbn: '978-0201633610',
    category: 'Software Architecture',
    publisher: 'Addison-Wesley',
    publicationYear: 1994,
    quantity: 4,
    description: 'Classic catalog of object-oriented design solutions and reusable patterns.'
  },
  {
    id: 'BK-108',
    title: 'You Don\'t Know JS Yet: Get Started',
    author: 'Kyle Simpson',
    isbn: '978-1838833961',
    category: 'Web Development',
    publisher: 'Independently Published',
    publicationYear: 2020,
    quantity: 5,
    description: 'Deep dive into the core mechanics, scope, and closures of JavaScript.'
  },
  {
    id: 'BK-109',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0441172719',
    category: 'Sci-Fi',
    publisher: 'Chilton Books',
    publicationYear: 1965,
    quantity: 4,
    description: 'Epic masterpiece sci-fi novel set on the desert planet Arrakis.'
  },
  {
    id: 'BK-110',
    title: 'Neuromancer',
    author: 'William Gibson',
    isbn: '978-0441569564',
    category: 'Sci-Fi',
    publisher: 'Ace Books',
    publicationYear: 1984,
    quantity: 3,
    description: 'Groundbreaking cyberpunk novel introducing cyberspace and AI constructs.'
  },
  {
    id: 'BK-111',
    title: 'Foundation',
    author: 'Isaac Asimov',
    isbn: '978-0553293357',
    category: 'Sci-Fi',
    publisher: 'Gnome Press',
    publicationYear: 1951,
    quantity: 3,
    description: 'Saga of Hari Seldon and psychohistory predicting the fall of Galactic Empire.'
  },
  {
    id: 'BK-112',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    category: 'History',
    publisher: 'Harper',
    publicationYear: 2014,
    quantity: 4,
    description: 'Comprehensive historical analysis of how Homo sapiens conquered Earth.'
  },
  {
    id: 'BK-113',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    isbn: '978-0465050659',
    category: 'Design & UX',
    publisher: 'Basic Books',
    publicationYear: 2013,
    quantity: 3,
    description: 'Essential primer on usability, human psychology, and product design.'
  },
  {
    id: 'BK-114',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Self Development',
    publisher: 'Avery',
    publicationYear: 2018,
    quantity: 5,
    description: 'Proven framework for improving every day through tiny habit changes.'
  },
  {
    id: 'BK-115',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0374533557',
    category: 'Psychology',
    publisher: 'Farrar, Straus and Giroux',
    publicationYear: 2011,
    quantity: 3,
    description: 'Nobel laureate exploration of System 1 fast intuition vs System 2 slow logic.'
  },
  {
    id: 'BK-116',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    isbn: '978-0307887894',
    category: 'Business',
    publisher: 'Crown Business',
    publicationYear: 2011,
    quantity: 3,
    description: 'Continuous innovation framework for launching successful modern products.'
  },
  {
    id: 'BK-117',
    title: 'Code Complete: A Practical Handbook of Software Construction',
    author: 'Steve McConnell',
    isbn: '978-0735619678',
    category: 'Computer Science',
    publisher: 'Microsoft Press',
    publicationYear: 2004,
    quantity: 2,
    description: 'Encyclopedic practical synthesis of effective software development techniques.'
  },
  {
    id: 'BK-118',
    title: 'Continuous Delivery',
    author: 'Jez Humble & David Farley',
    isbn: '978-0321601910',
    category: 'DevOps',
    publisher: 'Addison-Wesley',
    publicationYear: 2010,
    quantity: 2,
    description: 'Reliable software releases through build, test, and deployment automation.'
  },
  {
    id: 'BK-119',
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    isbn: '978-1455586691',
    category: 'Self Development',
    publisher: 'Grand Central Publishing',
    publicationYear: 2016,
    quantity: 4,
    description: 'Guide to mastering intense focus and producing high value in modern work.'
  },
  {
    id: 'BK-120',
    title: 'The Art of Computer Programming (Vol 1-4)',
    author: 'Donald E. Knuth',
    isbn: '978-0321751041',
    category: 'Computer Science',
    publisher: 'Addison-Wesley',
    publicationYear: 2011,
    quantity: 1,
    description: 'Monumental classic series covering fundamental computer algorithms.'
  }
];

// Initial Demo Transactions (Returned, Active, and OVERDUE)
export const INITIAL_TRANSACTIONS = [
  {
    id: 'TX-1001',
    bookId: 'BK-101',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    memberId: '901020500',
    memberName: 'Mohapi Thoabala',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    returnDate: '2026-08-14',
    status: 'Returned'
  },
  {
    id: 'TX-1002',
    bookId: 'BK-102',
    bookTitle: 'Designing Data-Intensive Applications',
    memberId: '901020501',
    memberName: 'Sello Thoabala',
    issueDate: '2026-09-01',
    dueDate: '2026-09-15', // Overdue since current date is 2026-09-30
    returnDate: null,
    status: 'Overdue'
  },
  {
    id: 'TX-1003',
    bookId: 'BK-103',
    bookTitle: 'The Pragmatic Programmer',
    memberId: '901020502',
    memberName: 'Tumelo Mabuti',
    issueDate: '2026-09-05',
    dueDate: '2026-09-19', // Overdue
    returnDate: null,
    status: 'Overdue'
  },
  {
    id: 'TX-1004',
    bookId: 'BK-105',
    bookTitle: 'Introduction to Algorithms (4th Edition)',
    memberId: '901020503',
    memberName: 'Tumelo Khutlang',
    issueDate: '2026-09-22',
    dueDate: '2026-10-10', // Active loan
    returnDate: null,
    status: 'Active'
  },
  {
    id: 'TX-1005',
    bookId: 'BK-114',
    bookTitle: 'Atomic Habits',
    memberId: '901020504',
    memberName: 'Ratile Thulo',
    issueDate: '2026-09-25',
    dueDate: '2026-10-15', // Active loan
    returnDate: null,
    status: 'Active'
  }
];

// Initial Settings
export const INITIAL_SETTINGS = {
  libraryName: 'NEXUS — Community Library',
  defaultLoanPeriodDays: 14,
  maxLoansPerMember: 3,
  overdueFinePerDay: 2.00,
  currency: 'M'
};

// Safe JSON parser to avoid storage corruption app crashes
function safeParse(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.error(`Error parsing localStorage key "${key}":`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing to localStorage key "${key}":`, err);
  }
}

// Storage API
export function initializeStorage() {
  if (!localStorage.getItem(KEYS.BOOKS)) {
    safeSet(KEYS.BOOKS, INITIAL_BOOKS);
  }
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    safeSet(KEYS.MEMBERS, INITIAL_MEMBERS);
  }
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
    safeSet(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }
  if (!localStorage.getItem(KEYS.NEXT_MEMBER_ID)) {
    safeSet(KEYS.NEXT_MEMBER_ID, 901020506);
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    safeSet(KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    // Default logged in user is Librarian Sechaba Thoabala
    safeSet(KEYS.CURRENT_USER, INITIAL_LIBRARIAN);
  }
}

export function getBooks() {
  initializeStorage();
  return safeParse(KEYS.BOOKS, INITIAL_BOOKS);
}

export function saveBooks(books) {
  safeSet(KEYS.BOOKS, books);
}

export function getMembers() {
  initializeStorage();
  return safeParse(KEYS.MEMBERS, INITIAL_MEMBERS);
}

export function saveMembers(members) {
  safeSet(KEYS.MEMBERS, members);
}

export function getTransactions() {
  initializeStorage();
  const txs = safeParse(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  
  // Dynamically calculate and sync overdue status
  let updated = false;
  const synchronized = txs.map(tx => {
    if (tx.status !== 'Returned' && isOverdue(tx.dueDate, tx.status)) {
      if (tx.status !== 'Overdue') {
        updated = true;
        return { ...tx, status: 'Overdue' };
      }
    }
    return tx;
  });

  if (updated) {
    safeSet(KEYS.TRANSACTIONS, synchronized);
  }

  return synchronized;
}

export function saveTransactions(transactions) {
  safeSet(KEYS.TRANSACTIONS, transactions);
}

export function getNextMemberId() {
  initializeStorage();
  const currentNext = safeParse(KEYS.NEXT_MEMBER_ID, 901020506);
  
  // Ensure next ID is always higher than any existing member ID
  const members = getMembers();
  let maxId = 901020505;
  members.forEach(m => {
    const numericId = parseInt(m.id, 10);
    if (!isNaN(numericId) && numericId !== 901020525 && numericId > maxId) {
      maxId = numericId;
    }
  });

  const validNext = Math.max(currentNext, maxId + 1);
  if (validNext !== currentNext) {
    safeSet(KEYS.NEXT_MEMBER_ID, validNext);
  }
  return validNext;
}

export function incrementNextMemberId() {
  const current = getNextMemberId();
  const next = current + 1;
  safeSet(KEYS.NEXT_MEMBER_ID, next);
  return next;
}

export function getCurrentUser() {
  initializeStorage();
  return safeParse(KEYS.CURRENT_USER, INITIAL_LIBRARIAN);
}

export function setCurrentUser(user) {
  safeSet(KEYS.CURRENT_USER, user);
}

export function logout() {
  safeSet(KEYS.CURRENT_USER, null);
}

export function getSettings() {
  initializeStorage();
  return safeParse(KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveSettings(settings) {
  safeSet(KEYS.SETTINGS, settings);
}

export function resetToDefaults() {
  safeSet(KEYS.BOOKS, INITIAL_BOOKS);
  safeSet(KEYS.MEMBERS, INITIAL_MEMBERS);
  safeSet(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  safeSet(KEYS.NEXT_MEMBER_ID, 901020506);
  safeSet(KEYS.SETTINGS, INITIAL_SETTINGS);
  safeSet(KEYS.CURRENT_USER, INITIAL_LIBRARIAN);
}
