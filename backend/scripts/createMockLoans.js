import { DocumentStore } from 'ravendb';
import { config } from 'dotenv';

// Load environment variables
config();

// Create database connection to BorrowerPortal
const store = new DocumentStore(
    process.env.RAVENDB_URL || 'http://127.0.0.1:8080',
    'BorrowerPortal'
);
store.initialize();

// Mock loan data for hunter@portolarails.com
const mockLoans = [
    {
        applicationId: "mock-app-1",
        borrower: {
            firstName: "Alice",
            lastName: "Johnson",
            phoneNumber: "4155551234",
            dateOfBirth: "03/15/1990",
            address: {
                street: "123 Main Street",
                aptSuite: "Apt 2B",
                city: "San Francisco",
                state: "CA",
                zipCode: "94102"
            },
            housingStatus: "Rent"
        },
        employment: {
            educationLevel: "bachelors",
            educationDetails: {
                schoolName: "UC Berkeley",
                graduationYear: "2012",
                areaOfStudy: "stem"
            },
            income: [{
                id: "1",
                incomeType: "employed-salary",
                jobTitle: "Software Engineer",
                company: "Tech Corp",
                startYear: "2020",
                annualIncome: "95000",
                startMonth: "01"
            }],
            savings: {
                savingsAmount: "15000",
                investmentAmount: "25000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "Yes, and it's fully paid off",
                vehicleMileage: "45000"
            }
        },
        loan: {
            requestedAmount: 150,
            requestedPurpose: "Home improvement",
            originalLoanAmount: 150,
            approvedAmount: 150,
            interestRate: 5.5,
            term: 48,
            monthlyPayment: 3.45,
            issueDate: "2025-01-15",
            maturityDate: "2029-01-15",
            endDate: "2029-01-15"
        }
    },
    {
        applicationId: "mock-app-2",
        borrower: {
            firstName: "Bob",
            lastName: "Smith",
            phoneNumber: "5105552345",
            dateOfBirth: "07/22/1985",
            address: {
                street: "456 Oak Avenue",
                aptSuite: "",
                city: "Oakland",
                state: "CA",
                zipCode: "94607"
            },
            housingStatus: "Own"
        },
        employment: {
            educationLevel: "masters",
            educationDetails: {
                schoolName: "Stanford University",
                graduationYear: "2009",
                areaOfStudy: "humanities"
            },
            income: [{
                id: "2",
                incomeType: "employed-salary",
                jobTitle: "Marketing Manager",
                company: "Marketing Solutions",
                startYear: "2018",
                annualIncome: "78000",
                startMonth: "03"
            }],
            savings: {
                savingsAmount: "8000",
                investmentAmount: "45000",
                hasRecentLoans: true,
                vehicleOwnershipStatus: "Yes, but I still owe money on it",
                vehicleMileage: "72000"
            }
        },
        loan: {
            requestedAmount: 200,
            requestedPurpose: "Debt consolidation",
            originalLoanAmount: 200,
            approvedAmount: 200,
            interestRate: 6.0,
            term: 60,
            monthlyPayment: 3.45,
            issueDate: "2025-01-10",
            maturityDate: "2030-01-10",
            endDate: "2030-01-10"
        }
    },
    {
        applicationId: "mock-app-3",
        borrower: {
            firstName: "Carol",
            lastName: "Davis",
            phoneNumber: "4155553456",
            dateOfBirth: "11/08/1988",
            address: {
                street: "789 Pine Street",
                aptSuite: "Unit 5",
                city: "Berkeley",
                state: "CA",
                zipCode: "94704"
            },
            housingStatus: "Rent"
        },
        employment: {
            educationLevel: "phd",
            educationDetails: {
                schoolName: "UC San Francisco",
                graduationYear: "2016",
                areaOfStudy: "stem"
            },
            income: [{
                id: "3",
                incomeType: "employed-salary",
                jobTitle: "Research Scientist",
                company: "BioTech Labs",
                startYear: "2017",
                annualIncome: "105000",
                startMonth: "09"
            }],
            savings: {
                savingsAmount: "22000",
                investmentAmount: "65000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "No",
                vehicleMileage: ""
            }
        },
        loan: {
            requestedAmount: 125,
            requestedPurpose: "Medical expenses",
            originalLoanAmount: 125,
            approvedAmount: 125,
            interestRate: 4.5,
            term: 36,
            monthlyPayment: 3.45,
            issueDate: "2025-01-05",
            maturityDate: "2028-01-05",
            endDate: "2028-01-05"
        }
    },
    {
        applicationId: "mock-app-4",
        borrower: {
            firstName: "David",
            lastName: "Wilson",
            phoneNumber: "6505554567",
            dateOfBirth: "05/30/1992",
            address: {
                street: "321 Elm Drive",
                aptSuite: "",
                city: "Palo Alto",
                state: "CA",
                zipCode: "94301"
            },
            housingStatus: "Own"
        },
        employment: {
            educationLevel: "bachelors",
            educationDetails: {
                schoolName: "Santa Clara University",
                graduationYear: "2014",
                areaOfStudy: "humanities"
            },
            income: [{
                id: "4",
                incomeType: "self-employed-proprietor",
                description: "Freelance Consulting",
                annualIncome: "68000",
                startYear: "2019",
                startMonth: "06"
            }],
            savings: {
                savingsAmount: "12000",
                investmentAmount: "18000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "Yes, and it's fully paid off",
                vehicleMileage: "32000"
            }
        },
        loan: {
            requestedAmount: 175,
            requestedPurpose: "Business startup",
            originalLoanAmount: 175,
            approvedAmount: 175,
            interestRate: 7.0,
            term: 54,
            monthlyPayment: 3.45,
            issueDate: "2025-01-01",
            maturityDate: "2029-07-01",
            endDate: "2029-07-01"
        }
    },
    {
        applicationId: "mock-app-5",
        borrower: {
            firstName: "Emma",
            lastName: "Brown",
            phoneNumber: "4155555678",
            dateOfBirth: "09/12/1987",
            address: {
                street: "654 Maple Lane",
                aptSuite: "Apt 3A",
                city: "Mountain View",
                state: "CA",
                zipCode: "94043"
            },
            housingStatus: "Rent"
        },
        employment: {
            educationLevel: "masters",
            educationDetails: {
                schoolName: "San Jose State University",
                graduationYear: "2011",
                areaOfStudy: "stem"
            },
            income: [{
                id: "5",
                incomeType: "employed-hourly",
                jobTitle: "UX Designer",
                company: "Design Studio",
                startYear: "2021",
                hourlyRate: "45",
                hoursPerWeek: "40",
                startMonth: "02"
            }],
            savings: {
                savingsAmount: "6000",
                investmentAmount: "12000",
                hasRecentLoans: true,
                vehicleOwnershipStatus: "Yes, but I still owe money on it",
                vehicleMileage: "55000"
            }
        },
        loan: {
            requestedAmount: 300,
            requestedPurpose: "Education",
            originalLoanAmount: 300,
            approvedAmount: 300,
            interestRate: 5.0,
            term: 84,
            monthlyPayment: 3.45,
            issueDate: "2024-12-28",
            maturityDate: "2031-12-28",
            endDate: "2031-12-28"
        }
    },
    {
        applicationId: "mock-app-6",
        borrower: {
            firstName: "Frank",
            lastName: "Garcia",
            phoneNumber: "4085556789",
            dateOfBirth: "01/25/1989",
            address: {
                street: "987 Cedar Court",
                aptSuite: "",
                city: "Sunnyvale",
                state: "CA",
                zipCode: "94086"
            },
            housingStatus: "Own"
        },
        employment: {
            educationLevel: "associate",
            educationDetails: {
                schoolName: "De Anza College",
                graduationYear: "2009"
            },
            income: [{
                id: "6",
                incomeType: "employed-salary",
                jobTitle: "Operations Manager",
                company: "Logistics Co",
                startYear: "2016",
                annualIncome: "72000",
                startMonth: "08"
            }],
            savings: {
                savingsAmount: "9000",
                investmentAmount: "28000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "No",
                vehicleMileage: ""
            }
        },
        loan: {
            requestedAmount: 180,
            requestedPurpose: "Vehicle purchase",
            originalLoanAmount: 180,
            approvedAmount: 180,
            interestRate: 6.5,
            term: 56,
            monthlyPayment: 3.45,
            issueDate: "2024-12-25",
            maturityDate: "2029-08-25",
            endDate: "2029-08-25"
        }
    },
    {
        applicationId: "mock-app-7",
        borrower: {
            firstName: "Grace",
            lastName: "Martinez",
            phoneNumber: "6505557890",
            dateOfBirth: "04/18/1991",
            address: {
                street: "147 Birch Street",
                aptSuite: "Unit 7",
                city: "Redwood City",
                state: "CA",
                zipCode: "94063"
            },
            housingStatus: "Rent"
        },
        employment: {
            educationLevel: "bachelors",
            educationDetails: {
                schoolName: "San Francisco State University",
                graduationYear: "2013",
                areaOfStudy: "humanities"
            },
            income: [{
                id: "7",
                incomeType: "employed-salary",
                jobTitle: "Account Executive",
                company: "Sales Corp",
                startYear: "2019",
                annualIncome: "85000",
                startMonth: "04"
            }],
            savings: {
                savingsAmount: "11000",
                investmentAmount: "35000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "Yes, and it's fully paid off",
                vehicleMileage: "38000"
            }
        },
        loan: {
            requestedAmount: 225,
            requestedPurpose: "Home improvement",
            originalLoanAmount: 225,
            approvedAmount: 225,
            interestRate: 5.75,
            term: 68,
            monthlyPayment: 3.45,
            issueDate: "2024-12-20",
            maturityDate: "2030-08-20",
            endDate: "2030-08-20"
        }
    },
    {
        applicationId: "mock-app-8",
        borrower: {
            firstName: "Henry",
            lastName: "Lopez",
            phoneNumber: "6505558901",
            dateOfBirth: "12/03/1986",
            address: {
                street: "258 Walnut Avenue",
                aptSuite: "",
                city: "San Mateo",
                state: "CA",
                zipCode: "94401"
            },
            housingStatus: "Own"
        },
        employment: {
            educationLevel: "high-school-diploma",
            educationDetails: {
                graduationYear: "2004"
            },
            income: [{
                id: "8",
                incomeType: "employed-salary",
                jobTitle: "Warehouse Supervisor",
                company: "Distribution Center",
                startYear: "2015",
                annualIncome: "58000",
                startMonth: "11"
            }],
            savings: {
                savingsAmount: "4000",
                investmentAmount: "8000",
                hasRecentLoans: true,
                vehicleOwnershipStatus: "Yes, but I still owe money on it",
                vehicleMileage: "89000"
            }
        },
        loan: {
            requestedAmount: 160,
            requestedPurpose: "Debt consolidation",
            originalLoanAmount: 160,
            approvedAmount: 160,
            interestRate: 8.0,
            term: 48,
            monthlyPayment: 3.45,
            issueDate: "2024-12-15",
            maturityDate: "2028-12-15",
            endDate: "2028-12-15"
        }
    },
    {
        applicationId: "mock-app-9",
        borrower: {
            firstName: "Iris",
            lastName: "Anderson",
            phoneNumber: "6505559012",
            dateOfBirth: "08/14/1993",
            address: {
                street: "369 Spruce Road",
                aptSuite: "Apt 1B",
                city: "Foster City",
                state: "CA",
                zipCode: "94404"
            },
            housingStatus: "Rent"
        },
        employment: {
            educationLevel: "certificate-program",
            educationDetails: {
                schoolName: "Bay Area Technical Institute",
                graduationYear: "2015"
            },
            income: [{
                id: "9",
                incomeType: "employed-hourly",
                jobTitle: "Medical Assistant",
                company: "Healthcare Clinic",
                startYear: "2018",
                hourlyRate: "28",
                hoursPerWeek: "35",
                startMonth: "05"
            }],
            savings: {
                savingsAmount: "3000",
                investmentAmount: "5000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "Yes, and it's fully paid off",
                vehicleMileage: "67000"
            }
        },
        loan: {
            requestedAmount: 140,
            requestedPurpose: "Medical expenses",
            originalLoanAmount: 140,
            approvedAmount: 140,
            interestRate: 7.5,
            term: 42,
            monthlyPayment: 3.45,
            issueDate: "2024-12-10",
            maturityDate: "2028-06-10",
            endDate: "2028-06-10"
        }
    },
    {
        applicationId: "mock-app-10",
        borrower: {
            firstName: "Jack",
            lastName: "Taylor",
            phoneNumber: "6505550123",
            dateOfBirth: "06/27/1984",
            address: {
                street: "741 Poplar Street",
                aptSuite: "",
                city: "Menlo Park",
                state: "CA",
                zipCode: "94025"
            },
            housingStatus: "Own"
        },
        employment: {
            educationLevel: "jd",
            educationDetails: {
                schoolName: "Golden Gate University",
                graduationYear: "2010",
                areaOfStudy: "humanities"
            },
            income: [{
                id: "10",
                incomeType: "self-employed-partnership",
                description: "Legal Services Partnership",
                annualIncome: "125000",
                startYear: "2012",
                startMonth: "01"
            }],
            savings: {
                savingsAmount: "35000",
                investmentAmount: "85000",
                hasRecentLoans: false,
                vehicleOwnershipStatus: "Yes, and it's fully paid off",
                vehicleMileage: "42000"
            }
        },
        loan: {
            requestedAmount: 190,
            requestedPurpose: "Business startup",
            originalLoanAmount: 190,
            approvedAmount: 190,
            interestRate: 6.25,
            term: 58,
            monthlyPayment: 3.45,
            issueDate: "2024-12-05",
            maturityDate: "2029-10-05",
            endDate: "2029-10-05"
        }
    }
];

async function createMockLoans() {
    console.log('Creating 10 mock loans directly in BorrowerPortal database...');
    
    const session = store.openSession();
    
    try {
        for (let i = 0; i < mockLoans.length; i++) {
            const loan = {
                ...mockLoans[i],
                createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Stagger creation dates
                createdBy: "mock-underwriter-hunter-portolarails",
                '@metadata': {
                    '@collection': 'Loans'
                }
            };
            
            await session.store(loan);
            console.log(`Created loan ${i + 1}: ${loan.borrower.firstName} ${loan.borrower.lastName} - $${loan.loan.approvedAmount} at $${loan.loan.monthlyPayment}/month`);
        }
        
        await session.saveChanges();
        console.log('✅ Successfully created 10 mock loans in BorrowerPortal database!');
        console.log('All loans have monthly payments of $3.45 for Plaid integration testing.');
        
    } catch (error) {
        console.error('❌ Error creating mock loans:', error);
    } finally {
        session.dispose();
        store.dispose();
    }
}

// Run the script
createMockLoans();