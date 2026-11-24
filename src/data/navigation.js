import { LayoutDashboard, Settings, ShoppingBag, Users } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];
