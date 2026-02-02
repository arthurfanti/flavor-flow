import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MagicModal } from './MagicModal';

describe('MagicModal', () => {
  it('renders correctly when open', () => {
    render(
      <MagicModal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </MagicModal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <MagicModal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </MagicModal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(
      <MagicModal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </MagicModal>
    );
    
    // Assuming the backdrop is the outer container
    const dialog = screen.getByRole('dialog');
    // We'll click the parent of the dialog content, which serves as the backdrop
    await user.click(dialog);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
