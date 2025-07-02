# Contributing Guide

## Welcome Contributors!

Thank you for your interest in contributing to the QR Scanner Event Checker App! This guide will help you understand our development process, coding standards, and how to submit contributions effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Development Workflow](#development-workflow)
6. [Testing Guidelines](#testing-guidelines)
7. [Submitting Changes](#submitting-changes)
8. [Code Review Process](#code-review-process)
9. [Issue Reporting](#issue-reporting)
10. [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **Git** for version control
- **Expo CLI** (`npm install -g @expo/cli`)
- **Code Editor** (VS Code recommended)

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-react-native"
  ]
}
```

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/event-checker-app.git
cd event-checker-app

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/event-checker-app.git
```

### 2. Install Dependencies

```bash
# Install project dependencies
npm install

# Verify installation
npx expo doctor
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Configure your local environment
# Edit .env with your local settings
```

### 4. Start Development Server

```bash
# Start Expo development server
npm run dev

# Or start with specific platform
npm run ios
npm run android
npm run web
```

## Project Structure

Understanding the project structure is crucial for effective contributions:

```
event-checker-app/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout
│   ├── (auth)/                  # Authentication stack
│   │   ├── _layout.tsx         # Auth layout
│   │   └── login.tsx           # Login screen
│   └── (tabs)/                  # Main tab navigation
│       ├── _layout.tsx         # Tab layout
│       ├── index.tsx           # Dashboard
│       ├── wristbands.tsx      # Wristbands management
│       ├── scanner.tsx         # QR scanner
│       └── profile.tsx         # User profile
├── components/                   # Reusable components
│   ├── dashboard/               # Dashboard components
│   └── wristbands/             # Wristband components
├── services/                    # Business logic
│   ├── api.ts                  # API service
│   └── auth.ts                 # Authentication service
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── assets/                      # Static assets
├── __tests__/                   # Test files
└── docs/                        # Documentation
```

### File Naming Conventions

- **Components**: PascalCase (`VenueCapacity.tsx`)
- **Screens**: PascalCase (`LoginScreen.tsx`)
- **Services**: camelCase (`authService.ts`)
- **Hooks**: camelCase with `use` prefix (`useFrameworkReady.ts`)
- **Types**: PascalCase (`UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_CONSTANTS.ts`)

## Coding Standards

### TypeScript Guidelines

#### 1. Type Definitions
```typescript
// Always define interfaces for data structures
interface WristbandData {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
}

// Use union types for specific values
type Theme = 'light' | 'dark' | 'auto';

// Use generics for reusable components
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### 2. Component Props
```typescript
// Always type component props
interface VenueCapacityProps {
  current: number;
  max: number;
  percentage: number;
  isLoading: boolean;
  onRefresh?: () => void;
}

export function VenueCapacity({ 
  current, 
  max, 
  percentage, 
  isLoading,
  onRefresh 
}: VenueCapacityProps) {
  // Component implementation
}
```

#### 3. Async Functions
```typescript
// Always type async function returns
const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const response = await ApiService.getUser(userId);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};
```

### React Native Styling

#### 1. StyleSheet Usage
```typescript
// Always use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1E8FF',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 16,
  },
});
```

#### 2. Color System
```typescript
// Use consistent color palette
const Colors = {
  primary: '#021024',
  secondary: '#052859',
  accent: '#7DA0CA',
  background: '#C1E8FF',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FFA726',
} as const;

// Usage in styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
  },
});
```

#### 3. Responsive Design
```typescript
// Use Dimensions for responsive layouts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width > 768 ? '50%' : '100%',
    maxWidth: 400,
  },
});
```

### Component Guidelines

#### 1. Component Structure
```typescript
// Standard component structure
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effect hooks
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
}

// Styles at the bottom
const styles = StyleSheet.create({
  // Styles
});
```

#### 2. Error Handling
```typescript
// Implement proper error boundaries
const ComponentWithErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleAsyncOperation = async () => {
    try {
      setLoading(true);
      setError(null);
      await someAsyncOperation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return <ErrorDisplay message={error} onRetry={handleAsyncOperation} />;
  }
  
  return <MainContent loading={loading} />;
};
```

#### 3. Performance Optimization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <ComplexRender data={data} />;
});

// Use useCallback for event handlers
const handlePress = useCallback((id: string) => {
  onItemPress(id);
}, [onItemPress]);

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => expensiveTransform(item));
}, [data]);
```

## Development Workflow

### 1. Branch Strategy

We use Git Flow branching model:

```bash
# Main branches
main        # Production-ready code
develop     # Integration branch for features

# Supporting branches
feature/*   # New features
bugfix/*    # Bug fixes
hotfix/*    # Critical production fixes
release/*   # Release preparation
```

### 2. Feature Development

```bash
# Start new feature
git checkout develop
git pull upstream develop
git checkout -b feature/new-scanner-feature

# Make changes and commit
git add .
git commit -m "feat: add enhanced QR scanner with validation"

# Push to your fork
git push origin feature/new-scanner-feature

# Create pull request to develop branch
```

### 3. Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc.)
refactor: # Code refactoring
test:     # Adding or updating tests
chore:    # Maintenance tasks

# Examples
feat(scanner): add QR code validation
fix(auth): resolve login timeout issue
docs: update API documentation
style: format code with prettier
refactor(components): extract common button component
test(api): add unit tests for auth service
chore: update dependencies
```

### 4. Code Quality Checks

Before committing, ensure your code passes all checks:

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Run all checks
npm run validate
```

## Testing Guidelines

### 1. Test Structure

```typescript
// Component test example
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

describe('LoginScreen', () => {
  it('should handle successful login', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
    
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockLogin} />
    );
    
    // Arrange
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');
    
    // Act
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    // Assert
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

### 2. Service Testing

```typescript
// Service test example
import { ApiService } from '../ApiService';

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should verify wristband successfully', async () => {
    // Arrange
    const mockQRCode = 'WB-123456';
    
    // Act
    const result = await ApiService.verifyWristband(mockQRCode);
    
    // Assert
    expect(result.valid).toBe(true);
    expect(result.message).toContain('verificado');
  });
  
  it('should handle invalid wristband', async () => {
    // Arrange
    const mockQRCode = 'invalid-code';
    
    // Act
    const result = await ApiService.verifyWristband(mockQRCode);
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toContain('no válido');
  });
});
```

### 3. Integration Testing

```typescript
// Integration test example
describe('Authentication Flow', () => {
  it('should complete login to dashboard flow', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);
    
    // Start at login screen
    expect(getByText('Iniciar Sesión')).toBeTruthy();
    
    // Enter credentials
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Iniciar Sesión'));
    
    // Should navigate to dashboard
    await waitFor(() => {
      expect(queryByText('Dashboard')).toBeTruthy();
    });
  });
});
```

### 4. Test Coverage

Maintain minimum test coverage:
- **Components**: 80% coverage
- **Services**: 90% coverage
- **Utilities**: 95% coverage

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Submitting Changes

### 1. Pre-submission Checklist

Before submitting a pull request:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No console.log statements in production code
- [ ] TypeScript types are properly defined
- [ ] Performance impact is considered

### 2. Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### 3. Pull Request Process

1. **Create Pull Request**: Submit PR to `develop` branch
2. **Automated Checks**: Ensure CI/CD pipeline passes
3. **Code Review**: Address reviewer feedback
4. **Testing**: Verify changes work as expected
5. **Merge**: Maintainer merges after approval

## Code Review Process

### 1. Review Criteria

Reviewers will check for:

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean and maintainable?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Testing**: Are tests adequate and passing?
- **Documentation**: Is documentation updated?

### 2. Review Guidelines

#### For Authors
- Provide clear PR description
- Respond to feedback promptly
- Make requested changes
- Keep PRs focused and small

#### For Reviewers
- Be constructive and respectful
- Explain reasoning for suggestions
- Approve when satisfied
- Request changes if needed

### 3. Review Checklist

```markdown
## Code Review Checklist

### Functionality
- [ ] Code works as described
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Code Quality
- [ ] Code is readable and well-structured
- [ ] Naming conventions are followed
- [ ] No code duplication
- [ ] Comments explain complex logic

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms used
- [ ] Memory leaks prevented

### Security
- [ ] Input validation implemented
- [ ] No sensitive data exposed
- [ ] Authentication/authorization correct

### Testing
- [ ] Tests cover new functionality
- [ ] Tests are meaningful
- [ ] All tests pass

### Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Comments added for complex code
```

## Issue Reporting

### 1. Bug Reports

Use this template for bug reports:

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Device: [e.g. iPhone 12, Samsung Galaxy S21]
- OS: [e.g. iOS 15.0, Android 11]
- App Version: [e.g. 1.0.0]
- Expo SDK Version: [e.g. 52.0.30]

## Additional Context
Add any other context about the problem here.
```

### 2. Feature Requests

Use this template for feature requests:

```markdown
## Feature Description
A clear and concise description of what you want to happen.

## Problem Statement
Is your feature request related to a problem? Please describe.

## Proposed Solution
Describe the solution you'd like.

## Alternatives Considered
Describe any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.

## Implementation Notes
Any technical considerations or implementation details.
```

### 3. Issue Labels

We use these labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on
- `duplicate`: This issue or pull request already exists
- `priority:high`: High priority issue
- `priority:medium`: Medium priority issue
- `priority:low`: Low priority issue

## Community Guidelines

### 1. Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### 2. Communication

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Patient**: Remember that everyone has different experience levels
- **Be Inclusive**: Welcome newcomers and help them get started

### 3. Getting Help

If you need help:

1. **Documentation**: Check existing documentation first
2. **Issues**: Search existing issues for similar problems
3. **Discussions**: Use GitHub Discussions for questions
4. **Discord**: Join our community Discord server
5. **Email**: Contact maintainers directly for sensitive issues

### 4. Recognition

We appreciate all contributions! Contributors will be:

- Listed in the CONTRIBUTORS.md file
- Mentioned in release notes for significant contributions
- Invited to join the core team for outstanding contributions

## Development Resources

### 1. Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library Documentation](https://testing-library.com/docs/react-native-testing-library/intro/)

### 2. Development Tools

- **Expo Dev Tools**: Built-in debugging tools
- **React Native Debugger**: Advanced debugging
- **Flipper**: Mobile app debugger
- **VS Code Extensions**: Enhanced development experience

### 3. Learning Resources

- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
- [TypeScript Tutorial](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Testing Tutorial](https://testing-library.com/docs/react-native-testing-library/example-intro/)

Thank you for contributing to the QR Scanner Event Checker App! Your contributions help make this project better for everyone.