const Dashboard = ({ user }) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
            {user.role === 'superadmin' ? (
                <p>You have superadmin access.</p>
            ) : (
                <p>You have admin access.</p>
            )}
        </div>
    );
};

export default Dashboard;
