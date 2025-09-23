import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const { title, description } = formData;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Error fetching tasks');
      }
    };

    fetchTasks();
  }, []);

  // Handle input change
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new task
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, res.data]); // add new task to list
      setFormData({ title: '', description: '' }); // clear form
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding task');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Task form */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={title}
          onChange={onChange}
        /><br />
        <input
          type="text"
          name="description"
          placeholder="Task description"
          value={description}
          onChange={onChange}
        /><br />
        <button type="submit">Add Task</button>
      </form>

         {/* Task list */}
      <h3>Your Tasks:</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.description} -
            <em>{task.status}</em>

            {/* Toggle Status */}
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const newStatus = task.status === 'pending' ? 'completed' : 'pending';

                  const res = await axios.put(
                    `http://localhost:5000/api/tasks/${task._id}`,
                    { status: newStatus },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  // update the task list with new status
                  setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
                } catch (error) {
                  console.error(error);
                  alert(error.response?.data?.message || 'Error updating task');
                }
              }}
              style={{ marginLeft: '10px' }}
            >
              {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
            </button>

            {/* Delete button */}
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  setTasks(tasks.filter((t) => t._id !== task._id));
                } catch (error) {
                  console.error(error);
                  alert(error.response?.data?.message || 'Error deleting task');
                }
              }}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>


    </div>
  );
}

export default Dashboard;
