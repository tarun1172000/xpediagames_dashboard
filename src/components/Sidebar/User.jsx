import React, { useEffect, useState } from 'react';

// Styling can be done using CSS-in-JS or external CSS; I'll use inline styles for simplicity
const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Get the token from localStorage

    if (!token) {
      setError('Authorization token is missing.');
      setLoading(false);
      return;
    }

    // Fetch data from the API on component mount
    fetch('http://api.xpediagames.com/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use the token from localStorage
      }
    })
      .then(response => {
        if (response.status === 403) {
          
          setError('You do not have access to see this. As you are not an Admin, please contact the Admin to get access.');
          setLoading(false);
          throw new Error('Forbidden');
        } else if (!response.ok) {
          // Handle other errors
          throw new Error('An error occurred while fetching data.');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        if (error.message !== 'Forbidden') {
          setError(error.message);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorMessage}>
            <strong>Access Denied!</strong>
            <p>{error}</p>
          </div>
        </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Users List</h1>
      <div style={styles.userList}>
        {users.map(user => (
          <div key={user._id} style={styles.userCard}>
            <h3 style={styles.userName}>{user.email}</h3>
            <p style={styles.userRole}>{user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple styling for the User component
const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#f29c1e',
    marginBottom: '20px',
  },
  userList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  userCard: {
    backgroundColor: '#f29c1e',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  userName: {
    fontSize: '25px',
    fontWeight: 'bold',
    color: 'black',
  },
  userRole: {
    fontSize: '18px',
    color: 'black',
  },

  errorBox: {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f29c1e',
    border: '1px solid black',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    maxWidth: '80%',
    textAlign: 'center',
    zIndex: '9999', // Ensures it appears on top of other content
  },
  errorIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  errorMessage: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: "black",
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
};


export default User;


////////////////////////////////////////////////
// import React from 'react'

// const User = () => {
//   return (
//     <div>User</div>
//   )
// }

// export default User