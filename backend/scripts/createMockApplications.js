import { DocumentStore } from 'ravendb';
import { config } from 'dotenv';

// Load environment variables
config();

// Create database connection
const store = new DocumentStore(
    process.env.RAVENDB_URL || 'http://127.0.0.1:8080',
    'Applicants'
);
store.initialize();

// Mock data templates
const mockApplications = [
    {
        personalInfo: {
            firstName: "Alice",
            lastName: "Johnson",
            suffix: "",
            birthMonth: "03",
            birthDay: "15",
            birthYear: "1990",
            streetAddress: "123 Main Street",
            aptSuite: "Apt 2B",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102",
            housingStatus: "Rent",
            phoneNumber: "4155551234",
            textUpdatesConsent: true,
            educationLevel: "bachelors"
        },
        loanDetails: {
            loanPurpose: "Home improvement",
            loanAmount: 150
        },
        educationInfo: {
            schoolName: "UC Berkeley",
            graduationYear: "2012",
            areaOfStudy: "stem"
        },
        incomeInfo: {
            sources: [{
                id: "1",
                incomeType: "employed-salary",
                jobTitle: "Software Engineer",
                company: "Tech Corp",
                startYear: "2020",
                annualIncome: "95000",
                startMonth: "01"
            }]
        },
        financialInfo: {
            savingsAmount: "15000",
            investmentAmount: "25000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "Yes, and it's fully paid off",
            vehicleMileage: "45000"
        }
    },
    {
        personalInfo: {
            firstName: "Bob",
            lastName: "Smith",
            suffix: "",
            birthMonth: "07",
            birthDay: "22",
            birthYear: "1985",
            streetAddress: "456 Oak Avenue",
            aptSuite: "",
            city: "Oakland",
            state: "CA",
            zipCode: "94607",
            housingStatus: "Own",
            phoneNumber: "5105552345",
            textUpdatesConsent: false,
            educationLevel: "masters"
        },
        loanDetails: {
            loanPurpose: "Debt consolidation",
            loanAmount: 200
        },
        educationInfo: {
            schoolName: "Stanford University",
            graduationYear: "2009",
            areaOfStudy: "humanities"
        },
        incomeInfo: {
            sources: [{
                id: "2",
                incomeType: "employed-salary",
                jobTitle: "Marketing Manager",
                company: "Marketing Solutions",
                startYear: "2018",
                annualIncome: "78000",
                startMonth: "03"
            }]
        },
        financialInfo: {
            savingsAmount: "8000",
            investmentAmount: "45000",
            hasRecentLoans: true,
            vehicleOwnershipStatus: "Yes, but I still owe money on it",
            vehicleMileage: "72000"
        }
    },
    {
        personalInfo: {
            firstName: "Carol",
            lastName: "Davis",
            suffix: "",
            birthMonth: "11",
            birthDay: "08",
            birthYear: "1988",
            streetAddress: "789 Pine Street",
            aptSuite: "Unit 5",
            city: "Berkeley",
            state: "CA",
            zipCode: "94704",
            housingStatus: "Rent",
            phoneNumber: "4155553456",
            textUpdatesConsent: true,
            educationLevel: "phd"
        },
        loanDetails: {
            loanPurpose: "Medical expenses",
            loanAmount: 125
        },
        educationInfo: {
            schoolName: "UC San Francisco",
            graduationYear: "2016",
            areaOfStudy: "stem"
        },
        incomeInfo: {
            sources: [{
                id: "3",
                incomeType: "employed-salary",
                jobTitle: "Research Scientist",
                company: "BioTech Labs",
                startYear: "2017",
                annualIncome: "105000",
                startMonth: "09"
            }]
        },
        financialInfo: {
            savingsAmount: "22000",
            investmentAmount: "65000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "No",
            vehicleMileage: ""
        }
    },
    {
        personalInfo: {
            firstName: "David",
            lastName: "Wilson",
            suffix: "Jr",
            birthMonth: "05",
            birthDay: "30",
            birthYear: "1992",
            streetAddress: "321 Elm Drive",
            aptSuite: "",
            city: "Palo Alto",
            state: "CA",
            zipCode: "94301",
            housingStatus: "Own",
            phoneNumber: "6505554567",
            textUpdatesConsent: false,
            educationLevel: "bachelors"
        },
        loanDetails: {
            loanPurpose: "Business startup",
            loanAmount: 175
        },
        educationInfo: {
            schoolName: "Santa Clara University",
            graduationYear: "2014",
            areaOfStudy: "humanities"
        },
        incomeInfo: {
            sources: [{
                id: "4",
                incomeType: "self-employed-proprietor",
                description: "Freelance Consulting",
                annualIncome: "68000",
                startYear: "2019",
                startMonth: "06"
            }]
        },
        financialInfo: {
            savingsAmount: "12000",
            investmentAmount: "18000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "Yes, and it's fully paid off",
            vehicleMileage: "32000"
        }
    },
    {
        personalInfo: {
            firstName: "Emma",
            lastName: "Brown",
            suffix: "",
            birthMonth: "09",
            birthDay: "12",
            birthYear: "1987",
            streetAddress: "654 Maple Lane",
            aptSuite: "Apt 3A",
            city: "Mountain View",
            state: "CA",
            zipCode: "94043",
            housingStatus: "Rent",
            phoneNumber: "4155555678",
            textUpdatesConsent: true,
            educationLevel: "masters"
        },
        loanDetails: {
            loanPurpose: "Education",
            loanAmount: 300
        },
        educationInfo: {
            schoolName: "San Jose State University",
            graduationYear: "2011",
            areaOfStudy: "stem"
        },
        incomeInfo: {
            sources: [{
                id: "5",
                incomeType: "employed-hourly",
                jobTitle: "UX Designer",
                company: "Design Studio",
                startYear: "2021",
                hourlyRate: "45",
                hoursPerWeek: "40",
                startMonth: "02"
            }]
        },
        financialInfo: {
            savingsAmount: "6000",
            investmentAmount: "12000",
            hasRecentLoans: true,
            vehicleOwnershipStatus: "Yes, but I still owe money on it",
            vehicleMileage: "55000"
        }
    },
    {
        personalInfo: {
            firstName: "Frank",
            lastName: "Garcia",
            suffix: "",
            birthMonth: "01",
            birthDay: "25",
            birthYear: "1989",
            streetAddress: "987 Cedar Court",
            aptSuite: "",
            city: "Sunnyvale",
            state: "CA",
            zipCode: "94086",
            housingStatus: "Own",
            phoneNumber: "4085556789",
            textUpdatesConsent: false,
            educationLevel: "associate"
        },
        loanDetails: {
            loanPurpose: "Vehicle purchase",
            loanAmount: 180
        },
        educationInfo: {
            schoolName: "De Anza College",
            graduationYear: "2009"
        },
        incomeInfo: {
            sources: [{
                id: "6",
                incomeType: "employed-salary",
                jobTitle: "Operations Manager",
                company: "Logistics Co",
                startYear: "2016",
                annualIncome: "72000",
                startMonth: "08"
            }]
        },
        financialInfo: {
            savingsAmount: "9000",
            investmentAmount: "28000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "No",
            vehicleMileage: ""
        }
    },
    {
        personalInfo: {
            firstName: "Grace",
            lastName: "Martinez",
            suffix: "",
            birthMonth: "04",
            birthDay: "18",
            birthYear: "1991",
            streetAddress: "147 Birch Street",
            aptSuite: "Unit 7",
            city: "Redwood City",
            state: "CA",
            zipCode: "94063",
            housingStatus: "Rent",
            phoneNumber: "6505557890",
            textUpdatesConsent: true,
            educationLevel: "bachelors"
        },
        loanDetails: {
            loanPurpose: "Home improvement",
            loanAmount: 225
        },
        educationInfo: {
            schoolName: "San Francisco State University",
            graduationYear: "2013",
            areaOfStudy: "humanities"
        },
        incomeInfo: {
            sources: [{
                id: "7",
                incomeType: "employed-salary",
                jobTitle: "Account Executive",
                company: "Sales Corp",
                startYear: "2019",
                annualIncome: "85000",
                startMonth: "04"
            }]
        },
        financialInfo: {
            savingsAmount: "11000",
            investmentAmount: "35000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "Yes, and it's fully paid off",
            vehicleMileage: "38000"
        }
    },
    {
        personalInfo: {
            firstName: "Henry",
            lastName: "Lopez",
            suffix: "",
            birthMonth: "12",
            birthDay: "03",
            birthYear: "1986",
            streetAddress: "258 Walnut Avenue",
            aptSuite: "",
            city: "San Mateo",
            state: "CA",
            zipCode: "94401",
            housingStatus: "Own",
            phoneNumber: "6505558901",
            textUpdatesConsent: false,
            educationLevel: "high-school-diploma"
        },
        loanDetails: {
            loanPurpose: "Debt consolidation",
            loanAmount: 160
        },
        educationInfo: {
            graduationYear: "2004"
        },
        incomeInfo: {
            sources: [{
                id: "8",
                incomeType: "employed-salary",
                jobTitle: "Warehouse Supervisor",
                company: "Distribution Center",
                startYear: "2015",
                annualIncome: "58000",
                startMonth: "11"
            }]
        },
        financialInfo: {
            savingsAmount: "4000",
            investmentAmount: "8000",
            hasRecentLoans: true,
            vehicleOwnershipStatus: "Yes, but I still owe money on it",
            vehicleMileage: "89000"
        }
    },
    {
        personalInfo: {
            firstName: "Iris",
            lastName: "Anderson",
            suffix: "",
            birthMonth: "08",
            birthDay: "14",
            birthYear: "1993",
            streetAddress: "369 Spruce Road",
            aptSuite: "Apt 1B",
            city: "Foster City",
            state: "CA",
            zipCode: "94404",
            housingStatus: "Rent",
            phoneNumber: "6505559012",
            textUpdatesConsent: true,
            educationLevel: "certificate-program"
        },
        loanDetails: {
            loanPurpose: "Medical expenses",
            loanAmount: 140
        },
        educationInfo: {
            schoolName: "Bay Area Technical Institute",
            graduationYear: "2015"
        },
        incomeInfo: {
            sources: [{
                id: "9",
                incomeType: "employed-hourly",
                jobTitle: "Medical Assistant",
                company: "Healthcare Clinic",
                startYear: "2018",
                hourlyRate: "28",
                hoursPerWeek: "35",
                startMonth: "05"
            }]
        },
        financialInfo: {
            savingsAmount: "3000",
            investmentAmount: "5000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "Yes, and it's fully paid off",
            vehicleMileage: "67000"
        }
    },
    {
        personalInfo: {
            firstName: "Jack",
            lastName: "Taylor",
            suffix: "",
            birthMonth: "06",
            birthDay: "27",
            birthYear: "1984",
            streetAddress: "741 Poplar Street",
            aptSuite: "",
            city: "Menlo Park",
            state: "CA",
            zipCode: "94025",
            housingStatus: "Own",
            phoneNumber: "6505550123",
            textUpdatesConsent: false,
            educationLevel: "jd"
        },
        loanDetails: {
            loanPurpose: "Business startup",
            loanAmount: 190
        },
        educationInfo: {
            schoolName: "Golden Gate University",
            graduationYear: "2010",
            areaOfStudy: "humanities"
        },
        incomeInfo: {
            sources: [{
                id: "10",
                incomeType: "self-employed-partnership",
                description: "Legal Services Partnership",
                annualIncome: "125000",
                startYear: "2012",
                startMonth: "01"
            }]
        },
        financialInfo: {
            savingsAmount: "35000",
            investmentAmount: "85000",
            hasRecentLoans: false,
            vehicleOwnershipStatus: "Yes, and it's fully paid off",
            vehicleMileage: "42000"
        }
    }
];

async function createMockApplications() {
    console.log('Creating 10 mock applications...');
    
    const session = store.openSession();
    
    try {
        for (let i = 0; i < mockApplications.length; i++) {
            const application = {
                ...mockApplications[i],
                userId: "mock-user-id-hunter-portolarails",
                submittedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Stagger dates
                status: "pending",
                agreementInfo: {
                    agreedToTerms: true
                },
                '@metadata': {
                    '@collection': 'Applications'
                }
            };
            
            await session.store(application);
            console.log(`Created application ${i + 1}: ${application.personalInfo.firstName} ${application.personalInfo.lastName}`);
        }
        
        await session.saveChanges();
        console.log('✅ Successfully created 10 mock applications!');
        console.log('All applications have loan amounts that will result in ~$3.45 monthly payments when processed.');
        
    } catch (error) {
        console.error('❌ Error creating mock applications:', error);
    } finally {
        session.dispose();
        store.dispose();
    }
}

// Run the script
createMockApplications();