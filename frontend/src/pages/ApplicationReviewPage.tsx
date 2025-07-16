import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApplication, approveApplication, rejectApplication } from '../lib/api';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { InputMedium } from '../components/InputMedium';
import { CurrencyInput } from '../components/CurrencyInput';
import { Dropdown } from '../components/Dropdown';

interface Application {
  id: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    suffix?: string;
    birthMonth?: string;
    birthDay?: string;
    birthYear?: string;
    streetAddress?: string;
    aptSuite?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    housingStatus?: string;
    phoneNumber?: string;
    textUpdatesConsent?: boolean;
    educationLevel?: string;
  };
  loanDetails?: {
    loanPurpose?: string;
    loanAmount?: number;
  };
  educationInfo?: {
    lastEnrolledYear?: string;
    schoolName?: string;
    graduationYear?: string;
    areaOfStudy?: string;
  };
  incomeInfo?: {
    sources?: Array<{
      id?: string;
      incomeType?: string;
      jobTitle?: string;
      company?: string;
      startYear?: string;
      startMonth?: string;
      annualIncome?: string;
      hourlyRate?: string;
      hoursPerWeek?: string;
      additionalCompensation?: string;
      paycheckFrequency?: string;
      description?: string;
      otherIncomeType?: string;
      yearlyAmount?: string;
    }>;
  };
  financialInfo?: {
    savingsAmount?: string;
    investmentAmount?: string;
    hasRecentLoans?: boolean;
    vehicleOwnershipStatus?: string;
    vehicleMileage?: string;
  };
  agreementInfo?: {
    agreedToTerms?: boolean;
  };
  submittedAt: string;
  status: string;
}

const ApplicationReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Loan approval form state
  const [approvedAmount, setApprovedAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await getApplication(id!);
      console.log('Frontend received application:', data);
      setApplication(data);
      setApprovedAmount(data.loanDetails?.loanAmount?.toString() || '0');
      
      // Set default issue date to today
      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvedAmount || !interestRate || !term || !monthlyPayment || !issueDate || !maturityDate || !endDate) {
      setError('Please fill in all loan details');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      await approveApplication(id!, {
        originalLoanAmount: parseFloat(approvedAmount),
        approvedAmount: parseFloat(approvedAmount),
        interestRate: parseFloat(interestRate),
        term: parseInt(term),
        monthlyPayment: parseFloat(monthlyPayment),
        issueDate: issueDate,
        maturityDate: maturityDate,
        endDate: endDate
      });
      
      setSuccessMessage('Application approved successfully! The loan has been created and the borrower has been notified.');
      setShowSuccess(true);
      setShowApprovalForm(false);
      
      // Navigate back to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      await rejectApplication(id!, rejectionReason);
      
      setSuccessMessage('Application rejected successfully. The borrower has been notified of the decision.');
      setShowSuccess(true);
      setShowRejectionForm(false);
      
      // Navigate back to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    if (approvedAmount && interestRate && term) {
      const principal = parseFloat(approvedAmount);
      const rate = parseFloat(interestRate) / 100 / 12;
      const months = parseInt(term);
      
      if (rate === 0) {
        setMonthlyPayment((principal / months).toFixed(2));
      } else {
        const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        setMonthlyPayment(payment.toFixed(2));
      }
    }
  };

  const calculateDates = () => {
    if (issueDate && term) {
      const issue = new Date(issueDate);
      const termMonths = parseInt(term);
      
      // Calculate maturity date (issue date + term)
      const maturity = new Date(issue);
      maturity.setMonth(maturity.getMonth() + termMonths);
      setMaturityDate(maturity.toISOString().split('T')[0]);
      
      // For now, end date is same as maturity date
      // (could be different if there are grace periods, etc.)
      setEndDate(maturity.toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [approvedAmount, interestRate, term]);

  useEffect(() => {
    calculateDates();
  }, [issueDate, term]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cotton to-sand flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-portola-green"></div>
          <p className="mt-2 text-steel">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cotton to-sand flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-alert mb-4">{error || 'Application not found'}</p>
            <Link to="/">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cotton to-sand">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-pebble">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-portola-green hover:text-forest-moss">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-serif font-semibold text-portola-green">
                Application Review
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-steel">
                Welcome, {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-8 bg-grass border border-grass/20 rounded-lg p-4 shadow-soft">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {successMessage}
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Redirecting to dashboard in 3 seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-8 bg-alert border border-alert/20 rounded-lg p-4 shadow-soft">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {error}
                </p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setError('')}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Full Name
                    </label>
                    <p className="text-steel">
                      {application.personalInfo?.firstName || 'N/A'} {application.personalInfo?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Date of Birth
                    </label>
                    <p className="text-steel">
                      {application.personalInfo?.birthMonth && application.personalInfo?.birthDay && application.personalInfo?.birthYear 
                        ? `${application.personalInfo.birthMonth}/${application.personalInfo.birthDay}/${application.personalInfo.birthYear}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Email
                    </label>
                    <p className="text-steel">Not available in data</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Phone
                    </label>
                    <p className="text-steel">{application.personalInfo?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                    Address
                  </label>
                  <p className="text-steel">
                    {application.personalInfo?.streetAddress || 'N/A'} {application.personalInfo?.aptSuite || ''}<br />
                    {application.personalInfo?.city || 'N/A'}, {application.personalInfo?.state || 'N/A'} {application.personalInfo?.zipCode || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                    Housing Status
                  </label>
                  <p className="text-steel">{application.personalInfo?.housingStatus || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Purpose
                    </label>
                    <p className="text-steel">{application.loanDetails?.loanPurpose || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Requested Amount
                    </label>
                    <p className="text-steel font-semibold text-lg">
                      {application.loanDetails?.loanAmount ? formatAmount(application.loanDetails.loanAmount) : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Details */}
            <Card>
              <CardHeader>
                <CardTitle>Education Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Education Level
                    </label>
                    <p className="text-steel">{application.personalInfo?.educationLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      School Name
                    </label>
                    <p className="text-steel">{application.educationInfo?.schoolName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Area of Study
                    </label>
                    <p className="text-steel">{application.educationInfo?.areaOfStudy || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Graduation Year
                    </label>
                    <p className="text-steel">{application.educationInfo?.graduationYear || 'N/A'}</p>
                  </div>
                  {application.educationInfo?.lastEnrolledYear && (
                    <div>
                      <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                        Last Enrolled Year
                      </label>
                      <p className="text-steel">{application.educationInfo.lastEnrolledYear}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Employment & Income Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment & Income Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                    Income Sources
                  </label>
                  <div className="space-y-4">
                    {application.incomeInfo?.sources?.length ? (
                      application.incomeInfo.sources.map((source, index) => (
                        <div key={index} className="bg-cotton p-4 rounded-lg border border-pebble">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                Income Type
                              </label>
                              <p className="text-steel text-sm">{source.incomeType || 'N/A'}</p>
                            </div>
                            {source.jobTitle && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Job Title
                                </label>
                                <p className="text-steel text-sm">{source.jobTitle}</p>
                              </div>
                            )}
                            {source.company && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Company
                                </label>
                                <p className="text-steel text-sm">{source.company}</p>
                              </div>
                            )}
                            {(source.startMonth || source.startYear) && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Start Date
                                </label>
                                <p className="text-steel text-sm">
                                  {source.startMonth && source.startYear 
                                    ? `${source.startMonth}/${source.startYear}`
                                    : (source.startYear || 'N/A')
                                  }
                                </p>
                              </div>
                            )}
                            {source.annualIncome && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Annual Income
                                </label>
                                <p className="text-portola-green font-semibold">{formatAmount(parseFloat(source.annualIncome))}</p>
                              </div>
                            )}
                            {source.hourlyRate && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Hourly Rate
                                </label>
                                <p className="text-steel text-sm">{formatAmount(parseFloat(source.hourlyRate))}</p>
                              </div>
                            )}
                            {source.hoursPerWeek && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Hours per Week
                                </label>
                                <p className="text-steel text-sm">{source.hoursPerWeek}</p>
                              </div>
                            )}
                            {source.additionalCompensation && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Additional Compensation
                                </label>
                                <p className="text-steel text-sm">{formatAmount(parseFloat(source.additionalCompensation))}</p>
                              </div>
                            )}
                            {source.paycheckFrequency && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Paycheck Frequency
                                </label>
                                <p className="text-steel text-sm">{source.paycheckFrequency}</p>
                              </div>
                            )}
                            {source.description && (
                              <div className="md:col-span-2">
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Description
                                </label>
                                <p className="text-steel text-sm">{source.description}</p>
                              </div>
                            )}
                            {source.otherIncomeType && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Other Income Type
                                </label>
                                <p className="text-steel text-sm">{source.otherIncomeType}</p>
                              </div>
                            )}
                            {source.yearlyAmount && (
                              <div>
                                <label className="block text-xs font-serif font-semibold text-charcoal mb-1">
                                  Yearly Amount
                                </label>
                                <p className="text-portola-green font-semibold">{formatAmount(parseFloat(source.yearlyAmount))}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-steel text-sm">No income sources provided</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Savings Balance
                    </label>
                    <p className="text-steel">{application.financialInfo?.savingsAmount ? formatAmount(parseFloat(application.financialInfo.savingsAmount)) : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Investment Balance
                    </label>
                    <p className="text-steel">{application.financialInfo?.investmentAmount ? formatAmount(parseFloat(application.financialInfo.investmentAmount)) : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Recent Loans
                    </label>
                    <p className="text-steel">
                      {application.financialInfo?.hasRecentLoans !== null 
                        ? (application.financialInfo.hasRecentLoans ? 'Yes' : 'No')
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Vehicle Ownership
                    </label>
                    <p className="text-steel">{application.financialInfo?.vehicleOwnershipStatus || 'N/A'}</p>
                  </div>
                  {application.financialInfo?.vehicleMileage && (
                    <div>
                      <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                        Vehicle Mileage
                      </label>
                      <p className="text-steel">{application.financialInfo.vehicleMileage} miles</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-serif font-semibold text-charcoal mb-1">
                      Text Updates Consent
                    </label>
                    <p className="text-steel">
                      {application.personalInfo?.textUpdatesConsent ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-steel">
                    Submitted: {formatDate(application.submittedAt)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-serif font-semibold text-charcoal">Status:</span>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-railway-gold text-charcoal">
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowApprovalForm(!showApprovalForm)}
                  className="w-full"
                  variant="outline"
                >
                  Approve Application
                </Button>
                <Button
                  onClick={() => setShowRejectionForm(!showRejectionForm)}
                  className="w-full"
                  variant="danger"
                >
                  Reject Application
                </Button>
              </CardContent>
            </Card>

            {/* Approval Form */}
            {showApprovalForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Loan Approval Details</CardTitle>
                  <CardDescription>
                    Enter the approved loan terms and dates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CurrencyInput
                    label="Original Loan Amount"
                    value={approvedAmount}
                    onChange={setApprovedAmount}
                    allowCents={false}
                  />
                  <InputMedium
                    label="Interest Rate (%)"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                  <Dropdown
                    label="Loan Term (months)"
                    value={term}
                    onChange={setTerm}
                    options={[
                      { value: '12', label: '12 months' },
                      { value: '24', label: '24 months' },
                      { value: '36', label: '36 months' },
                      { value: '48', label: '48 months' },
                      { value: '60', label: '60 months' }
                    ]}
                  />
                  <div className="w-full">
                    <InputMedium
                      label="Issue Date"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="[&>div>input]:text-left [&>div>input]:pl-3.5"
                    />
                  </div>
                  <div className="w-full">
                    <InputMedium
                      label="Maturity Date"
                      type="date"
                      value={maturityDate}
                      onChange={(e) => setMaturityDate(e.target.value)}
                      disabled
                      className="[&>div>input]:text-left [&>div>input]:pl-3.5"
                    />
                  </div>
                  <div className="w-full">
                    <InputMedium
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled
                      className="[&>div>input]:text-left [&>div>input]:pl-3.5"
                    />
                  </div>
                  <InputMedium
                    label="Monthly Payment"
                    type="number"
                    step="0.01"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    disabled
                  />
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Processing...' : 'Confirm Approval'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Rejection Form */}
            {showRejectionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Rejection Reason</CardTitle>
                  <CardDescription>
                    Please provide a reason for rejection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputMedium
                    label="Reason for Rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <Button
                    onClick={handleReject}
                    disabled={processing}
                    variant="danger"
                    className="w-full"
                  >
                    {processing ? 'Processing...' : 'Confirm Rejection'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationReviewPage;