import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
    PostCardSkeleton,
    FeaturedPostSkeleton,
    CategoryCardSkeleton,
    PostDetailSkeleton
} from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
    it('renders PostCardSkeleton without crashing', () => {
        const { container } = render(<PostCardSkeleton />);
        expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('renders FeaturedPostSkeleton without crashing', () => {
        const { container } = render(<FeaturedPostSkeleton />);
        expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('renders CategoryCardSkeleton without crashing', () => {
        const { container } = render(<CategoryCardSkeleton />);
        expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('renders PostDetailSkeleton without crashing', () => {
        const { container } = render(<PostDetailSkeleton />);
        // Check for an element with animate-pulse inside the container
        const pulseElement = container.querySelector('.animate-pulse');
        expect(pulseElement).toBeInTheDocument();
    });
});
