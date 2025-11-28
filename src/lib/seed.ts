import { supabase } from './supabase';
import slugify from 'slugify';

export const seedDatabase = async (userId?: string) => {
    try {
        // 1. Create Categories
        const categories = [
            {
                name: 'Wealth',
                slug: 'wealth',
                description: 'Strategies for building and preserving wealth.',
                icon: 'DollarSign',
                created_at: new Date().toISOString(),
            },
            {
                name: 'Lifestyle',
                slug: 'lifestyle',
                description: 'Living your best life, from travel to wellness.',
                icon: 'Coffee',
                created_at: new Date().toISOString(),
            },
            {
                name: 'Business',
                slug: 'business',
                description: 'Insights for entrepreneurs and leaders.',
                icon: 'Briefcase',
                created_at: new Date().toISOString(),
            },
        ];

        const { data: insertedCategories, error: catError } = await supabase
            .from('categories')
            .upsert(categories, { onConflict: 'slug' })
            .select();

        if (catError) throw catError;

        if (!insertedCategories) {
            throw new Error('Failed to insert categories');
        }

        // Map category slugs to IDs for easy lookup
        const catMap = insertedCategories.reduce((acc: any, cat: any) => {
            acc[cat.slug] = cat.id;
            return acc;
        }, {});

        // 2. Create Sample Posts
        const posts = [
            {
                title: 'The Art of Passive Income: 5 Strategies for 2025',
                slug: 'art-of-passive-income-2025',
                excerpt: 'Discover the most effective ways to generate wealth while you sleep in the coming year.',
                content: `# The Art of Passive Income

Passive income is the holy grail of personal finance. It's money that you earn without active involvement. Here are 5 strategies to consider for 2025:

## 1. Dividend Stocks
Investing in established companies that pay regular dividends is a time-tested strategy.

## 2. Real Estate Crowdfunding
Platforms now allow you to invest in property with as little as $500.

## 3. Digital Products
Create an online course or ebook once, and sell it forever.

## 4. High-Yield Savings Accounts
With interest rates stabilizing, HYSA remain a safe bet for your emergency fund.

## 5. Peer-to-Peer Lending
Lending money to individuals or small businesses can yield higher returns than traditional savings.`,
                author: 'Alexander Rich',
                author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                author_id: userId,
                category_id: catMap['wealth'],
                featured: true,
                published: true,
                read_time: 5,
                image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2071',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                title: 'Luxury Travel: Hidden Gems of the Mediterranean',
                slug: 'luxury-travel-mediterranean-gems',
                excerpt: 'Escape the crowds and discover the most exclusive and breathtaking spots in the Mediterranean.',
                content: `# Hidden Gems of the Mediterranean

The Mediterranean is famous for its blue waters and sunny skies, but popular spots can be overcrowded. Here are some hidden gems for the discerning traveler:

## 1. Menorca, Spain
Quieter than its neighbor Mallorca, Menorca offers pristine beaches and a relaxed vibe.

## 2. Milos, Greece
Known for its lunar landscapes and crystal-clear waters, Milos is a photographer's paradise.

## 3. Kotor, Montenegro
A stunning bay surrounded by mountains, Kotor offers history, culture, and luxury without the price tag of Dubrovnik.`,
                author: 'Isabella Voyage',
                author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                author_id: userId,
                category_id: catMap['lifestyle'],
                featured: true,
                published: true,
                read_time: 7,
                image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2066',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                title: 'Building a Personal Brand in the Digital Age',
                slug: 'building-personal-brand-digital-age',
                excerpt: 'Why your personal brand is your most valuable asset and how to cultivate it.',
                content: `# Your Personal Brand is Your Asset

In today's digital world, your reputation is everything. Building a strong personal brand can open doors to new opportunities.

## Consistency is Key
Ensure your message and visual identity are consistent across all platforms.

## Provide Value
Share your expertise and help others solve problems.

## Authenticity Wins
Be yourself. People connect with stories and genuine experiences.`,
                author: 'Marcus Sterling',
                author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                author_id: userId,
                category_id: catMap['business'],
                featured: false,
                published: true,
                read_time: 4,
                image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2074',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                title: 'Smart Investing: Navigating Crypto Volatility',
                slug: 'smart-investing-crypto-volatility',
                excerpt: 'How to manage risk and spot opportunities in the ever-changing world of cryptocurrency.',
                content: `# Navigating Crypto Volatility

Cryptocurrency markets are known for their swings. Here's how to stay sane and profitable:

*   **Dollar-Cost Averaging**: Invest a fixed amount regularly to smooth out the purchase price.
*   **Diversification**: Don't put all your eggs in one coin.
*   **Long-Term Perspective**: Focus on the technology and adoption trends, not daily price movements.`,
                author: 'Satoshi Nakamoto (Fan)',
                author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                author_id: userId,
                category_id: catMap['wealth'],
                featured: false,
                published: true,
                read_time: 6,
                image_url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=2069',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                title: 'The Future of Remote Work: Trends to Watch',
                slug: 'future-of-remote-work-trends',
                excerpt: 'Remote work is here to stay. Here are the key trends shaping the future of the distributed workforce.',
                content: `# The Future of Work is Distributed

Remote work has transformed from a necessity to a preference for many.

## Asynchronous Communication
Teams are moving away from constant meetings to written, async updates.

## Digital Nomad Visas
More countries are offering visas specifically for remote workers.

## Focus on Output, Not Hours
Performance is measured by what you deliver, not how long you sit at your desk.`,
                author: 'Sarah Remote',
                author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                author_id: userId,
                category_id: catMap['business'],
                featured: false,
                published: true,
                read_time: 5,
                image_url: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=2070',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];

        const { error: postError } = await supabase
            .from('posts')
            .upsert(posts, { onConflict: 'slug' });

        if (postError) throw postError;

        return { success: true, message: 'Database seeded successfully!' };
    } catch (error: any) {
        console.error('Error seeding database:', error);
        return { success: false, message: error.message };
    }
};
