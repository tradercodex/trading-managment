import { redirect } from 'next/navigation';

// Users management has moved under /dashboard/configuration (User Management tab)
export default function UsersPageRedirect() {
  redirect('/dashboard/configuration');
}
