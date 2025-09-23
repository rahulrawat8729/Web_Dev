import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Task Manager</h1>
      <p>
        Task Manager helps you stay organized by letting you:
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>✅ Register & Login securely</li>
        <li>✅ Add new tasks with title and description</li>
        <li>✅ Update task status (Pending / Completed)</li>
        <li>✅ Delete tasks when done</li>
      </ul>
      <p>
        Get started by <Link to="/register">Registering</Link> or{' '}
        <Link to="/login">Logging in</Link>.
      </p>
    </div>
  );
}

export default Home;
