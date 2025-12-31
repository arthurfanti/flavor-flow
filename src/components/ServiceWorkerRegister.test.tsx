import { render } from '@testing-library/react';
import ServiceWorkerRegister from './ServiceWorkerRegister';

describe('ServiceWorkerRegister', () => {
  it('registers service worker if supported', () => {
    // Mock navigator.serviceWorker
    const registerMock = jest.fn().mockResolvedValue({ scope: '/' });
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: registerMock,
      },
      writable: true,
    });

    render(<ServiceWorkerRegister />);

    expect(registerMock).toHaveBeenCalledWith('/sw.js');
  });

  it('does not crash if service worker is not supported', () => {
    // Remove serviceWorker from navigator
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: undefined,
      writable: true,
    });

    render(<ServiceWorkerRegister />);
    // Expect no errors
  });
});
