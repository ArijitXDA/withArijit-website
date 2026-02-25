// =====================================================
// useAdminPermissions - Admin permission checking hook
// =====================================================

import { useCallback } from 'react';
import type { AdminRole, AdminPermissions, AdminSession } from '../types/admin';
import { hasPermission, canManageRole, canImpersonate } from '../lib/permissions';

interface UseAdminPermissionsResult {
  checkPermission: (permission: keyof AdminPermissions) => boolean;
  canManage: (targetRole: AdminRole) => boolean;
  canImpersonateUsers: boolean;
  isDevAdmin: boolean;
  isSuperAdmin: boolean;
  role: AdminRole | null;
}

export function useAdminPermissions(session: AdminSession | null): UseAdminPermissionsResult {
  const role = session?.admin.role || null;
  const customPermissions = session?.admin.permissions;

  const checkPermission = useCallback(
    (permission: keyof AdminPermissions): boolean => {
      if (!role) return false;
      return hasPermission(role, permission, customPermissions);
    },
    [role, customPermissions]
  );

  const canManage = useCallback(
    (targetRole: AdminRole): boolean => {
      if (!role) return false;
      return canManageRole(role, targetRole);
    },
    [role]
  );

  const canImpersonateUsers = role ? canImpersonate(role) : false;
  const isDevAdmin = role === 'dev_admin';
  const isSuperAdmin = role === 'super_admin';

  return {
    checkPermission,
    canManage,
    canImpersonateUsers,
    isDevAdmin,
    isSuperAdmin,
    role,
  };
}
