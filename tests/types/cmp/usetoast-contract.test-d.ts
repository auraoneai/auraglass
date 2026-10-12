/* REQ-CMP-107: useToast satisfies the contract UseToast shape —
   toast/update/dismiss/promise/toasts/history, Intent incl 'danger'. */
import type { UseToast, ToastOptions, Intent } from '../../../src/contracts/components';
import { useToast } from '../../../src/components/toast';

const _check: ReturnType<UseToast> = {} as ReturnType<typeof useToast>;
void _check;

// Intent union includes 'danger'
const dangerIntent: Intent = 'danger';
void dangerIntent;

const opt: ToastOptions = { title: 't', intent: 'danger', priority: 'high' };
void opt;

// @ts-expect-error — 'error' is a 4.x compat intent, not a contract Intent
const badIntent: Intent = 'error';
void badIntent;

// REQ-CMP-107: the hook itself is assignable to the contract hook type (the
// extra 4.x conveniences add/close/info/... are a superset, never a narrowing).
const _hook: UseToast = useToast;
void _hook;

// priority accepts only the contract union
// @ts-expect-error — 'assertive' is the 4.x OVL-62 value, replaced by 'high'
const badPriority: ToastOptions = { title: 't', priority: 'assertive' };
void badPriority;
