'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role, User } from '@prisma/client';

interface RoleChangerProps {
  user: User;
  currentUserId: string;
}

export default function RoleChanger({ user, currentUserId }: RoleChangerProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (newRole: Role) => {
    setIsLoading(true);
    setSelectedRole(newRole);

    try {
      await fetch(`/api/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to update role', error);
      // Optionally revert the state on error
      setSelectedRole(user.role);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin cannot change their own role
  if (user.id === currentUserId) {
    return <span className="text-sm text-gray-500">Nie można zmienić</span>;
  }

  return (
    <select
      value={selectedRole}
      onChange={(e) => handleRoleChange(e.target.value as Role)}
      disabled={isLoading}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-200"
    >
      {Object.values(Role).map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}
