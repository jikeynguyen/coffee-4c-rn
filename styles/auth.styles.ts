import { Platform, StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    marginBottom: 4,
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '500',
    textAlign: 'left',
    width: '100%',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    color: '#1f2937',
    height: 44,
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    marginTop: 8, 
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#0ea5e9',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16, 
    marginBottom: 20,
  },
  signupText: {
    color: '#4a5568',
    fontSize: 12,
  },
  signupLink: {
    color: '#0ea5e9',
    fontWeight: '600',
    marginLeft: 4,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 10, 
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  radioButtonSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0ea5e9',
  },
  radioText: {
    color: '#1f2937',
    fontSize: 14, 
  },
});
