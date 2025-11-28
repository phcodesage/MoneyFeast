import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import '@testing-library/jest-dom';
import Login from '../Login';
import Signup from '../Signup';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock Supabase client
vi.mock('../../../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
        },
    },
}));

// Import the mocked supabase to assert on it
import { supabase } from '../../../lib/supabase';

describe('Admin Flow Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Login Component', () => {
        it('renders login form correctly', () => {
            render(
                <HelmetProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Login />
                        </AuthProvider>
                    </BrowserRouter>
                </HelmetProvider>
            );

            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
            expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        });

        it('handles password visibility toggle', () => {
            render(
                <HelmetProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Login />
                        </AuthProvider>
                    </BrowserRouter>
                </HelmetProvider>
            );

            const passwordInput = screen.getByLabelText('Password');
            expect(passwordInput).toHaveAttribute('type', 'password');

            // Find the toggle button (it's the button inside the relative div)
            const toggleButton = passwordInput.parentElement?.querySelector('button');
            expect(toggleButton).toBeInTheDocument();

            // Click to show password
            if (toggleButton) {
                fireEvent.click(toggleButton);
                expect(passwordInput).toHaveAttribute('type', 'text');

                // Click to hide password
                fireEvent.click(toggleButton);
                expect(passwordInput).toHaveAttribute('type', 'password');
            }
        });

        it('calls signIn when form is submitted', async () => {
            (supabase.auth.signInWithPassword as any).mockResolvedValue({ error: null });

            render(
                <HelmetProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Login />
                        </AuthProvider>
                    </BrowserRouter>
                </HelmetProvider>
            );

            fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

            await waitFor(() => {
                expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });
        });
    });

    describe('Signup Component', () => {
        it('renders signup form correctly', () => {
            render(
                <HelmetProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Signup />
                        </AuthProvider>
                    </BrowserRouter>
                </HelmetProvider>
            );

            expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
            expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        });

        it('validates password match', async () => {
            render(
                <HelmetProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Signup />
                        </AuthProvider>
                    </BrowserRouter>
                </HelmetProvider>
            );

            fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'mismatch' } });

            fireEvent.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
            });

            expect(supabase.auth.signUp).not.toHaveBeenCalled();
        });

        it('calls signUp when form is valid', async () => {
            (supabase.auth.signUp as any).mockResolvedValue({ error: null });

            render(
                <HelmetProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Signup />
                        </AuthProvider>
                    </BrowserRouter>
                </HelmetProvider>
            );

            fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'new@example.com' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

            fireEvent.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(supabase.auth.signUp).toHaveBeenCalledWith({
                    email: 'new@example.com',
                    password: 'password123',
                });
            });
        });
    });
});
