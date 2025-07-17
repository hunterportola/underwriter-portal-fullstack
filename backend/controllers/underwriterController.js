import { DocumentStore } from 'ravendb';

// Create separate stores for reading applications and writing loans
const applicantsStore = new DocumentStore(
    process.env.RAVENDB_URL || 'http://127.0.0.1:8080',
    'Applicants'
);
applicantsStore.initialize();

const borrowerPortalStore = new DocumentStore(
    process.env.RAVENDB_URL || 'http://127.0.0.1:8080',
    'BorrowerPortal'
);
borrowerPortalStore.initialize();

// Get all pending applications
export const getPendingApplications = async (req, res) => {
    const session = applicantsStore.openSession();
    try {
        const applications = await session.query({ collection: 'Applications' })
            .whereEquals('status', 'pending')
            .orderByDescending('submittedAt')
            .all();

        // Debug logging to see actual data structure
        console.log('Fetched applications:', JSON.stringify(applications, null, 2));
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    } finally {
        session.dispose();
    }
};

// Get specific application by ID
export const getApplication = async (req, res) => {
    const { id } = req.params;
    const session = applicantsStore.openSession();
    try {
        const application = await session.load(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Debug logging to see actual data structure
        console.log('Fetched single application:', JSON.stringify(application, null, 2));
        
        res.json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    } finally {
        session.dispose();
    }
};

// Approve application and create loan
export const approveApplication = async (req, res) => {
    const { applicationId } = req.params;
    const loanDetails = req.body;

    // Validate required loan details
    const requiredFields = ['approvedAmount', 'interestRate', 'term', 'monthlyPayment', 'issueDate', 'maturityDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !loanDetails[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: 'Missing required loan details', 
            missingFields 
        });
    }

    // Validate data types and ranges
    if (isNaN(loanDetails.approvedAmount) || loanDetails.approvedAmount <= 0) {
        return res.status(400).json({ message: 'Approved amount must be a positive number' });
    }
    
    if (isNaN(loanDetails.interestRate) || loanDetails.interestRate < 0) {
        return res.status(400).json({ message: 'Interest rate must be a non-negative number' });
    }
    
    if (isNaN(loanDetails.term) || loanDetails.term <= 0) {
        return res.status(400).json({ message: 'Term must be a positive number' });
    }
    
    if (isNaN(loanDetails.monthlyPayment) || loanDetails.monthlyPayment <= 0) {
        return res.status(400).json({ message: 'Monthly payment must be a positive number' });
    }

    // Validate dates
    const issueDate = new Date(loanDetails.issueDate);
    const maturityDate = new Date(loanDetails.maturityDate);
    const endDate = new Date(loanDetails.endDate);
    
    if (isNaN(issueDate.getTime()) || isNaN(maturityDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (maturityDate <= issueDate) {
        return res.status(400).json({ message: 'Maturity date must be after issue date' });
    }

    const applicantsSession = applicantsStore.openSession();
    const borrowerPortalSession = borrowerPortalStore.openSession();

    try {
        // Get the application
        const application = await applicantsSession.load(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if application is still pending
        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Application has already been processed' });
        }

        // Update application status to approved
        application.status = 'approved';
        application.approvedAt = new Date();
        application.approvedBy = req.user.id;
        await applicantsSession.saveChanges();

        // Transform application data to loan format
        const loanData = {
            userId: application.userId,
            // Application data
            applicationId: applicationId,
            borrower: {
                firstName: application.personalInfo?.firstName || '',
                lastName: application.personalInfo?.lastName || '',
                phoneNumber: application.personalInfo?.phoneNumber || '',
                dateOfBirth: application.personalInfo?.birthMonth && application.personalInfo?.birthDay && application.personalInfo?.birthYear 
                    ? `${application.personalInfo.birthMonth}/${application.personalInfo.birthDay}/${application.personalInfo.birthYear}`
                    : '',
                address: {
                    street: application.personalInfo?.streetAddress || '',
                    aptSuite: application.personalInfo?.aptSuite || '',
                    city: application.personalInfo?.city || '',
                    state: application.personalInfo?.state || '',
                    zipCode: application.personalInfo?.zipCode || ''
                },
                housingStatus: application.personalInfo?.housingStatus || ''
            },
            employment: {
                educationLevel: application.personalInfo?.educationLevel || '',
                educationDetails: application.educationInfo || {},
                income: application.incomeInfo?.sources || [],
                savings: application.financialInfo || {}
            },
            // Loan details from underwriter
            loan: {
                requestedAmount: application.loanDetails?.loanAmount || 0,
                requestedPurpose: application.loanDetails?.loanPurpose || '',
                originalLoanAmount: loanDetails.originalLoanAmount || loanDetails.approvedAmount,
                approvedAmount: loanDetails.approvedAmount,
                interestRate: loanDetails.interestRate,
                term: loanDetails.term,
                monthlyPayment: loanDetails.monthlyPayment,
                issueDate: loanDetails.issueDate,
                maturityDate: loanDetails.maturityDate,
                endDate: loanDetails.endDate
            },
            createdAt: new Date(),
            createdBy: req.user.id,
            '@metadata': {
                '@collection': 'Loans'
            }
        };

        // Save loan to BorrowerPortal database
        await borrowerPortalSession.store(loanData);
        await borrowerPortalSession.saveChanges();

        res.json({ 
            message: 'Application approved and loan created successfully',
            loanId: loanData.id,
            applicationId: applicationId
        });

    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ message: 'Error approving application', error: error.message });
    } finally {
        applicantsSession.dispose();
        borrowerPortalSession.dispose();
    }
};

// Reject application
export const rejectApplication = async (req, res) => {
    const { applicationId } = req.params;
    const { reason } = req.body;

    // Validate rejection reason
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        return res.status(400).json({ message: 'Rejection reason is required' });
    }

    if (reason.trim().length > 1000) {
        return res.status(400).json({ message: 'Rejection reason must be less than 1000 characters' });
    }

    const session = applicantsStore.openSession();
    try {
        const application = await session.load(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if application is still pending
        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Application has already been processed' });
        }

        application.status = 'rejected';
        application.rejectedAt = new Date();
        application.rejectedBy = req.user.id;
        application.rejectionReason = reason;
        await session.saveChanges();

        res.json({ message: 'Application rejected successfully' });

    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ message: 'Error rejecting application', error: error.message });
    } finally {
        session.dispose();
    }
};