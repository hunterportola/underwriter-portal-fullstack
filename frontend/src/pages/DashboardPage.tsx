import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPendingApplications } from '../lib/api';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';

interface Application {
  id: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
  loanDetails?: {
    loanPurpose?: string;
    loanAmount?: number;
  };
  submittedAt: string;
  status: string;
}

const DashboardPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getPendingApplications();
      console.log('Frontend received applications:', data);
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-railway-gold text-charcoal';
      case 'approved':
        return 'bg-grass text-white';
      case 'rejected':
        return 'bg-alert text-white';
      default:
        return 'bg-pebble text-charcoal';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cotton to-sand">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-pebble">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-serif font-semibold text-portola-green">
                Underwriter Portal
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-portola-green">
                {applications.length}
              </div>
              <p className="text-sm text-steel mt-1">Applications to review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Avg. Loan Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-portola-green">
                {applications.length > 0 
                  ? formatAmount(applications.reduce((sum, app) => sum + (app.loanDetails?.loanAmount || 0), 0) / applications.length)
                  : '$0'
                }
              </div>
              <p className="text-sm text-steel mt-1">For pending applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={fetchApplications}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Refresh Applications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>
              Review and process loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-portola-green"></div>
                <p className="mt-2 text-steel">Loading applications...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-alert">{error}</p>
                <Button 
                  onClick={fetchApplications}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-steel">No pending applications found.</p>
              </div>
            )}

            {!loading && !error && applications.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-pebble">
                      <th className="text-left py-3 px-4 font-serif font-semibold text-charcoal">
                        Applicant
                      </th>
                      <th className="text-left py-3 px-4 font-serif font-semibold text-charcoal">
                        Loan Details
                      </th>
                      <th className="text-left py-3 px-4 font-serif font-semibold text-charcoal">
                        Submitted
                      </th>
                      <th className="text-left py-3 px-4 font-serif font-semibold text-charcoal">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-serif font-semibold text-charcoal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} className="border-b border-cotton hover:bg-cotton/50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-serif font-semibold text-charcoal">
                              {application.personalInfo?.firstName || 'N/A'} {application.personalInfo?.lastName || ''}
                            </p>
                            <p className="text-sm text-steel">No email in data</p>
                            <p className="text-sm text-steel">{application.personalInfo?.phoneNumber || 'No phone'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-serif font-semibold text-charcoal">
                              {application.loanDetails?.loanAmount ? formatAmount(application.loanDetails.loanAmount) : 'N/A'}
                            </p>
                            <p className="text-sm text-steel">{application.loanDetails?.loanPurpose || 'No purpose specified'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-steel">
                            {formatDate(application.submittedAt)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link to={`/application/${application.id}`}>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;