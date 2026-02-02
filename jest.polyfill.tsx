// Mock next-intl/navigation
jest.mock('next-intl/navigation', () => {
  const useRouter = jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }));
  const usePathname = jest.fn(() => '/');
  const Link = ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
  const redirect = jest.fn();

  return {
    createNavigation: jest.fn(() => ({
      Link,
      redirect,
      usePathname,
      useRouter,
    })),
    createSharedPathnamesNavigation: jest.fn(() => ({
      Link,
      redirect,
      usePathname,
      useRouter,
    })),
    Link,
    redirect,
    usePathname,
    useRouter,
  };
});

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => key,
  useLocale: () => 'en',
  useFormatter: () => ({
    dateTime: jest.fn(),
    number: jest.fn(),
  }),
  NextIntlClientProvider: ({ children }: any) => <>{children}</>,
}));

jest.mock('next-intl/server', () => ({
  getRequestConfig: jest.fn(),
}));
