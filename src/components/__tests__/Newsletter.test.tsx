import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Newsletter from '../Newsletter';
import { analytics } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';

// Mock dependencies
vi.mock('../../lib/analytics', () => ({
    analytics: {
        newsletterSubscribe: vi.fn(),
    },
}));

vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(),
        })),
    },
}));

describe('Newsletter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<Newsletter />);
        expect(screen.getByText(/Get Weekly Money-Making Tips/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
    });

    it('handles successful subscription', async () => {
        const mockInsert = vi.fn().mockResolvedValue({ error: null });
        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        render(<Newsletter />);

        const input = screen.getByPlaceholderText(/Enter your email address/i);
        const button = screen.getByRole('button', { name: /Subscribe Free/i });

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Subscribing...');

        await waitFor(() => {
            expect(screen.getByText(/Successfully subscribed/i)).toBeInTheDocument();
        });

        expect(mockInsert).toHaveBeenCalledWith([{ email: 'test@example.com', active: true }]);
        expect(analytics.newsletterSubscribe).toHaveBeenCalledWith('test@example.com');
    });

    it('handles duplicate email error', async () => {
        const mockInsert = vi.fn().mockResolvedValue({
            error: { code: '23505' } // Unique violation code
        });
        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        render(<Newsletter />);

        const input = screen.getByPlaceholderText(/Enter your email address/i);
        const button = screen.getByRole('button', { name: /Subscribe Free/i });

        fireEvent.change(input, { target: { value: 'existing@example.com' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/This email is already subscribed/i)).toBeInTheDocument();
        });
    });

    it('handles generic error', async () => {
        const mockInsert = vi.fn().mockResolvedValue({
            error: { message: 'Something went wrong' }
        });
        (supabase.from as any).mockReturnValue({ insert: mockInsert });

        // Suppress console.error for this test as we expect an error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<Newsletter />);

        const input = screen.getByPlaceholderText(/Enter your email address/i);
        const button = screen.getByRole('button', { name: /Subscribe Free/i });

        fireEvent.change(input, { target: { value: 'error@example.com' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Error subscribing:', { message: 'Something went wrong' });
        consoleSpy.mockRestore();
    });
});
