export const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is badly formatted.';
    case 'auth/user-disabled':
      return 'This user has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/invalid-credential':
      return 'The credential is invalid or expired. Please try signing in again.';
    default:
      return 'An error occurred during sign in. Please try again.';
  }
};