/**
 * HobbyHive Authentication Module
 * Handles user registration, login, password reset, and session management
 */

// User data structure in local storage:
// {
//   email: string,
//   username: string,
//   password: string,
//   role: 'recruiter' | 'freelancer',
//   companyName?: string,  // Only for recruiters
//   companyEmail?: string, // Only for recruiters
// }

/**
 * Registers a new user and stores their information in local storage
 * @param {Object} userData - User registration data
 * @returns {boolean} Success status
 */
function registerUser(userData) {
  try {
    // Check if local storage is available
    if (!isStorageAvailable('localStorage')) {
      console.error('Local storage is not available');
      return false;
    }

    console.log('Getting existing users...');
    
    // Check if email already exists
    const users = getUsers();
    if (users.some(user => user.email === userData.email)) {
      console.error('Email already registered:', userData.email);
      throw new Error('Email already registered');
    }

    console.log('Storing user data...');
    
    // Store the user data
    users.push(userData);
    localStorage.setItem('hobbyhive_users', JSON.stringify(users));
    
    // Set current user session
    setCurrentUser(userData);
    
    console.log('User registered successfully');
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
}

// Helper function to check if storage is available
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Authenticates a user based on email, password and role
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (recruiter or freelancer)
 * @returns {Object|null} User data if authenticated, null otherwise
 * @returns {Object|string} Error message if role mismatch
 */
function loginUser(email, password, role) {
  try {
    // Check if storage is available
    if (!isStorageAvailable('localStorage') || !isStorageAvailable('sessionStorage')) {
      console.error('Storage is not available');
      return null;
    }

    console.log('Attempting login with email:', email);
    
    const users = getUsers();
    console.log('Found users:', users.length);
    
    // First check if user exists with these credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log('Authentication failed: invalid credentials');
      return null;
    }
    
    // Now check if role matches
    if (role && user.role !== role) {
      console.log('Authentication failed: role mismatch. User is a', user.role, 'but trying to login as', role);
      return 'role_mismatch';
    }
    
    // Authentication successful
    console.log('User authenticated successfully:', user.username);
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

/**
 * Retrieves all registered users from local storage
 * @returns {Array} Array of user objects
 */
function getUsers() {
  try {
    const usersJson = localStorage.getItem('hobbyhive_users');
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error retrieving users:', error);
    return [];
  }
}

/**
 * Sets the current authenticated user in session storage
 * @param {Object} user - User data
 */
function setCurrentUser(user) {
  // Create a sanitized version without the password
  const sessionUser = { ...user };
  delete sessionUser.password;
  
  sessionStorage.setItem('hobbyhive_current_user', JSON.stringify(sessionUser));
}

/**
 * Gets the current authenticated user from session storage
 * @returns {Object|null} Current user data or null if not logged in
 */
function getCurrentUser() {
  try {
    const userJson = sessionStorage.getItem('hobbyhive_current_user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error retrieving current user:', error);
    return null;
  }
}

/**
 * Logs out the current user by removing their session and other stored data
 * @param {boolean} redirect - Whether to redirect after logout (default: false)
 */
function logoutUser(redirect = false) {
  // Remove user session
  sessionStorage.removeItem('hobbyhive_current_user');
  
  // Also remove any reset email (if present)
  sessionStorage.removeItem('hobbyhive_reset_email');
  
  // Clear any other session data that might cause auto-login
  sessionStorage.clear();
  
  // Add a flag to indicate a recent logout (prevents auto-login)
  localStorage.setItem('hobbyhive_just_logged_out', 'true');
  
  console.log('User logged out successfully');
  
  // Optionally redirect to login page
  if (redirect) {
    console.log('Redirecting to sign-in page after logout');
    window.location.href = 'sign-in.html';
  }
}

/**
 * Checks if a user is authenticated
 * @returns {boolean} True if user is authenticated
 */
function isAuthenticated() {
  // Check for the logout flag first
  const justLoggedOut = localStorage.getItem('hobbyhive_just_logged_out');
  
  if (justLoggedOut === 'true') {
    // Clear the flag
    localStorage.removeItem('hobbyhive_just_logged_out');
    
    // User has just logged out, so they're not authenticated regardless of session
    console.log('Recently logged out, preventing auto-login');
    
    // Also ensure the current user is cleared from session
    sessionStorage.removeItem('hobbyhive_current_user');
    return false;
  }
  
  // Normal authentication check
  return getCurrentUser() !== null;
}

/**
 * Checks if an email exists in the user database
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists
 */
function emailExists(email) {
  const users = getUsers();
  return users.some(user => user.email === email);
}

/**
 * Resets a user's password
 * @param {string} email - User's email
 * @param {string} newPassword - New password
 * @param {string} role - User role (optional)
 * @returns {boolean} Success status
 */
function resetPassword(email, newPassword, role) {
  try {
    // Check if storage is available
    if (!isStorageAvailable('localStorage')) {
      console.error('Local storage is not available');
      return false;
    }
    
    console.log('Attempting to reset password for email:', email, role ? 'with role: ' + role : '');
    
    const users = getUsers();
    console.log('Found users:', users.length);
    
    // Find the user by email and role if provided
    let userIndex;
    
    if (role) {
      // Find user by email AND role
      userIndex = users.findIndex(user => user.email === email && user.role === role);
      console.log('Looking for user with email and role match');
    } else {
      // Find user by email only
      userIndex = users.findIndex(user => user.email === email);
      console.log('Looking for user with email match only');
    }
    
    if (userIndex === -1) {
      if (role) {
        console.error(`No user found with email: ${email} and role: ${role}`);
      } else {
        console.error('No user found with email:', email);
      }
      return false;
    }
    
    console.log('Found user to reset password for:', users[userIndex].username, 'with role:', users[userIndex].role);
    
    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('hobbyhive_users', JSON.stringify(users));
    
    console.log('Password reset successful');
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
}

/**
 * Stores the email for password reset in session storage
 * @param {string} email - Email for password reset
 */
function storeResetEmail(email) {
  sessionStorage.setItem('hobbyhive_reset_email', email);
}

/**
 * Gets the email for password reset from session storage
 * @returns {string|null} Email for password reset or null
 */
function getResetEmail() {
  return sessionStorage.getItem('hobbyhive_reset_email');
}

/**
 * Redirects user to the appropriate dashboard based on role
 * @param {string} role - User role (recruiter or freelancer)
 */
function redirectToDashboard(role) {
  console.log('Redirecting to dashboard with role:', role);
  
  // Redirect based on role to external Netlify URLs
  if (role === 'recruiter') {
    window.location.href = 'https://genuine-daifuku-828ed5.netlify.app/loading_recruiter';
  } else {
    window.location.href = 'https://genuine-daifuku-828ed5.netlify.app/loading_freelancer';
  }
}

/**
 * Redirects user to dashboard or login page based on authentication status
 */
function checkAuthAndRedirect() {
  // First check if we just logged out - if so, don't auto-login
  if (localStorage.getItem('hobbyhive_just_logged_out') === 'true') {
    console.log('Recent logout detected, preventing auto-login');
    localStorage.removeItem('hobbyhive_just_logged_out');
    return false;
  }
  
  const user = getCurrentUser();
  
  if (user) {
    console.log('User authenticated, redirecting to dashboard');
    redirectToDashboard(user.role);
    return true;
  }
  
  return false;
}

/**
 * Protects routes by checking if user is authenticated
 * If not authenticated, redirects to login page
 */
function protectRoute() {
  if (!isAuthenticated()) {
    window.location.href = 'sign-in.html';
  }
}
