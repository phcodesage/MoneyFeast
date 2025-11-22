# Contributing to MoneyFeast

Thank you for considering contributing to MoneyFeast! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create an issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Any alternatives you've considered

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes following our coding standards:
   - Use TypeScript
   - Follow existing code style
   - Add comments for complex logic
   - Keep components small and focused
   - Use meaningful variable names

4. Test your changes:
   ```bash
   npm run dev
   npm run typecheck
   npm run lint
   ```

5. Commit with clear messages:
   ```bash
   git commit -m "feat: add search pagination"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes

## Development Setup

See the [README.md](README.md) for setup instructions.

## Coding Standards

### TypeScript

- Use explicit types when they add clarity
- Avoid `any` type
- Use interfaces for object shapes
- Export types that are used across files

### React

- Use functional components with hooks
- Keep components under 200 lines
- Extract reusable logic into custom hooks
- Use meaningful component and prop names

### Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use existing design tokens

### File Structure

- Components in `src/components/`
- Pages in `src/pages/`
- Utilities in `src/lib/`
- One component per file
- Use PascalCase for component files

## Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add pagination to search results`

## Questions?

Feel free to open an issue for any questions about contributing!
