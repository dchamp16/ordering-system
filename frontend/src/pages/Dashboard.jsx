import Dashboard from '../components/Dashboard';

const DashboardPage = ({ user }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Dashboard user={user} />
        </div>
    );
};

export default DashboardPage;
