import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecentPosts from '../RecentPosts';
import { supabase } from '../../lib/supabase';

// Mock dependencies
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    eq: vi.fn(() => ({
                        order: vi.fn(() => ({
                            limit: vi.fn(),
                        })),
                    })),
                })),
            })),
        })),
    },
}));

// Mock LoadingSkeleton to avoid animation issues in tests
vi.mock('../LoadingSkeleton', () => ({
    PostCardSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('RecentPosts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        // Mock a never-resolving promise to keep it in loading state
        const mockLimit = vi.fn().mockReturnValue(new Promise(() => { }));
        (supabase.from as any).mockReturnValue({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        order: () => ({
                            limit: mockLimit,
                        }),
                    }),
                }),
            }),
        });

        render(
            <BrowserRouter>
                <RecentPosts />
            </BrowserRouter>
        );

        expect(screen.getAllByTestId('skeleton')).toHaveLength(6);
    });

    it('renders posts after fetching', async () => {
        const mockPosts = [
            {
                id: '1',
                title: 'Test Post 1',
                excerpt: 'Excerpt 1',
                slug: 'test-post-1',
                author: 'Author 1',
                read_time: 5,
                created_at: '2023-01-01',
                category: { name: 'Finance' },
            },
            {
                id: '2',
                title: 'Test Post 2',
                excerpt: 'Excerpt 2',
                slug: 'test-post-2',
                author: 'Author 2',
                read_time: 3,
                created_at: '2023-01-02',
                category: { name: 'Investing' },
            },
        ];

        const mockLimit = vi.fn().mockResolvedValue({ data: mockPosts, error: null });
        (supabase.from as any).mockReturnValue({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        order: () => ({
                            limit: mockLimit,
                        }),
                    }),
                }),
            }),
        });

        render(
            <BrowserRouter>
                <RecentPosts />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Post 1')).toBeInTheDocument();
            expect(screen.getByText('Test Post 2')).toBeInTheDocument();
        });

        expect(screen.getByText('Finance')).toBeInTheDocument();
        expect(screen.getByText('Investing')).toBeInTheDocument();
    });

    it('handles error state gracefully', async () => {
        const mockLimit = vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } });
        (supabase.from as any).mockReturnValue({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        order: () => ({
                            limit: mockLimit,
                        }),
                    }),
                }),
            }),
        });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <BrowserRouter>
                <RecentPosts />
            </BrowserRouter>
        );

        await waitFor(() => {
            // Should stop loading and show empty list (or whatever the component does on error)
            // The component sets posts to [] on error, so it should render the section title but no posts
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Latest Guides')).toBeInTheDocument();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
