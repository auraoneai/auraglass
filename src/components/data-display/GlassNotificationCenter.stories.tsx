import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';
import { cn } from '../../lib/utils';
import { GlassButton } from '../button/GlassButton';
import {
    GlassNotificationCenter,
    GlassNotificationProvider,
    useNotifications
} from './GlassNotificationCenter';

const meta: Meta<typeof GlassNotificationCenter> = {
  title: 'Components/Data-Display/GlassNotificationCenter',
  component: GlassNotificationCenter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A sophisticated notification system with glass morphism styling and advanced positioning.',
      },
    },
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
      description: 'Position of the notification center',
    },
    maxNotifications: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of notifications to show',
    },
    autoHideDelay: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: 'Auto-hide delay for non-persistent notifications (ms)',
    },
  },
  args: {
    position: 'top-right',
    maxNotifications: 5,
    autoHideDelay: 5000,
  },
};

export default meta;
type Story = StoryObj<typeof GlassNotificationCenter>;

// Notification trigger component
const NotificationDemo = ({ position }: { position: any }) => {
  const { addNotification, removeNotification, clearAll } = useNotifications();

  const showSuccess = () => {
    addNotification({
      type: 'success',
      title: 'Success!',
      message: 'Your action was completed successfully.',
      duration: 4000,
    });
  };

  const showError = () => {
    addNotification({
      type: 'error',
      title: 'Error Occurred',
      message: 'Something went wrong. Please try again.',
      duration: 6000,
    });
  };

  const showWarning = () => {
    addNotification({
      type: 'warning',
      title: 'Warning',
      message: 'This action cannot be undone.',
      duration: 5000,
    });
  };

  const showInfo = () => {
    addNotification({
      type: 'info',
      title: 'Information',
      message: 'Here is some important information for you.',
      duration: 4000,
    });
  };

  const showPersistent = () => {
    addNotification({
      type: 'info',
      title: 'Persistent Notification',
      message: 'This notification will stay until manually dismissed.',
      persistent: true,
      action: {
        label: 'Learn More',
        onClick: fn(),
      },
    });
  };

  return (
    <div className="gap-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Notification Center Demo</h3>
        <p className="text-sm opacity-80">Click the buttons below to trigger different types of notifications.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md mx-auto">
        <GlassButton onClick={showSuccess} variant="success" size="sm">
          Success
        </GlassButton>
        <GlassButton onClick={showError} variant="error" size="sm">
          Error
        </GlassButton>
        <GlassButton onClick={showWarning} variant="warning" size="sm">
          Warning
        </GlassButton>
        <GlassButton onClick={showInfo} size="sm">
          Info
        </GlassButton>
        <GlassButton onClick={showPersistent} variant="secondary" size="sm">
          Persistent
        </GlassButton>
        <GlassButton onClick={clearAll} variant="outline" size="sm">
          Clear All
        </GlassButton>
      </div>

      <GlassNotificationCenter position={position} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <GlassNotificationProvider>
      <NotificationDemo position={args.position} />
    </GlassNotificationProvider>
  ),
};

export const Positions: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Notification Positions</h3>
        <p className="text-sm opacity-80">Try different positions for the notification center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'] as const).map((position) => (
          <div key={position} className="border border-white/20 glass-radius-lg p-4">
            <h4 className="text-sm font-medium mb-3 capitalize text-center">{position.replace('-', ' ')}</h4>
            <GlassNotificationProvider>
              <NotificationDemo position={position} />
              <GlassNotificationCenter position={position} />
            </GlassNotificationProvider>
          </div>
        ))}
      </div>
    </div>
  ),
  args: {},
};

export const NotificationTypes: Story = {
  render: (args) => {
    const { addNotification } = useNotifications();

    React.useEffect(() => {
      // Add sample notifications of each type
      const notifications = [
        {
          type: 'success' as const,
          title: 'Task Completed',
          message: 'Your file has been uploaded successfully.',
        },
        {
          type: 'error' as const,
          title: 'Upload Failed',
          message: 'The file size exceeds the maximum limit.',
        },
        {
          type: 'warning' as const,
          title: 'Storage Warning',
          message: 'You are running low on storage space.',
        },
        {
          type: 'info' as const,
          title: 'New Feature',
          message: 'Check out our latest updates and improvements.',
        },
      ];

      notifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification({
            ...notification,
            duration: 8000,
          });
        }, index * 500);
      });
    }, []);

    return (
      <div className="text-center gap-4">
        <h3 className="text-lg font-semibold">Notification Types</h3>
        <p className="text-sm opacity-80">All notification types are displayed above.</p>
        <GlassNotificationCenter {...args} />
      </div>
    );
  },
  args: {},
};

export const WithActions: Story = {
  render: (args) => {
    const { addNotification } = useNotifications();

    const showActionNotification = () => {
      addNotification({
        type: 'info',
        title: 'Action Required',
        message: 'Please review and confirm your recent changes.',
        persistent: true,
        action: {
          label: 'Review Now',
          onClick: fn(),
        },
      });
    };

    return (
      <div className="text-center gap-4">
        <h3 className="text-lg font-semibold mb-2">Notifications with Actions</h3>
        <p className="text-sm opacity-80 mb-4">Click the button to see a notification with an action button.</p>
        <GlassButton onClick={showActionNotification}>Show Action Notification</GlassButton>
        <GlassNotificationCenter {...args} />
      </div>
    );
  },
  args: {},
};

export const BulkNotifications: Story = {
  render: (args) => {
    const { addNotification } = useNotifications();

    const showBulkNotifications = () => {
      const types: ('success' | 'error' | 'warning' | 'info')[] = ['success', 'error', 'warning', 'info'];
      const messages = [
        'File uploaded successfully',
        'Database connection failed',
        'Disk space running low',
        'System update available',
        'Backup completed',
        'Network timeout occurred',
      ];

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          addNotification({
            type: types[i % types.length],
            title: messages[i],
            message: `Notification ${i + 1} of 6`,
            duration: 7000,
          });
        }, i * 300);
      }
    };

    return (
      <div className="text-center gap-4">
        <h3 className="text-lg font-semibold mb-2">Bulk Notifications</h3>
        <p className="text-sm opacity-80 mb-4">Test how the system handles multiple notifications.</p>
        <GlassButton onClick={showBulkNotifications}>Show 6 Notifications</GlassButton>
        <GlassNotificationCenter {...args} />
      </div>
    );
  },
  args: {},
};

export const CustomStyling: Story = {
  render: (args) => (
    <GlassNotificationProvider>
      <div className="text-center gap-4">
        <h3 className="text-lg font-semibold mb-2">Custom Styled Notifications</h3>
        <p className="text-sm opacity-80 mb-4">Notifications with custom glass morphism styling.</p>
        <GlassNotificationCenter
          {...args}
          className="custom-notification-center"
        />
      </div>
    </GlassNotificationProvider>
  ),
  args: {
    position: 'top-center',
    maxNotifications: 3,
  },
};