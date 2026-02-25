// =====================================================
// RBAC Permission System
// =====================================================

import type { AdminRole, AdminPermissions } from '../types/admin';

/**
 * Default permissions for each admin role.
 * dev_admin and super_admin get all permissions.
 * Stage-specific admins get targeted permissions.
 */
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermissions> = {
  dev_admin: {
    courses: true,
    batches: true,
    students: true,
    enrollments: true,
    payments: true,
    discounts: true,
    group_bookings: true,
    study_materials: true,
    ai_chat: true,
    email_templates: true,
    reports: true,
    qr_campaigns: true,
    ai_spot: true,
    certificates: true,
    session_links: true,
    user_management: true,
    impersonation: true,
  },
  super_admin: {
    courses: true,
    batches: true,
    students: true,
    enrollments: true,
    payments: true,
    discounts: true,
    group_bookings: true,
    study_materials: true,
    ai_chat: true,
    email_templates: true,
    reports: true,
    qr_campaigns: true,
    ai_spot: true,
    certificates: true,
    session_links: true,
    user_management: false, // Cannot create dev_admins
    impersonation: false,
  },
  course_admin: {
    courses: true,
    batches: true,
    study_materials: true,
    enrollments: true,
  },
  payment_admin: {
    payments: true,
    discounts: true,
    group_bookings: true,
  },
  hr_admin: {
    students: true,
    enrollments: true,
    certificates: true,
    reports: true,
  },
  campaign_admin: {
    discounts: true,
    email_templates: true,
  },
  qr_admin: {
    qr_campaigns: true,
  },
  aispot_admin: {
    ai_spot: true,
  },
  report_viewer: {
    reports: true,
  },
};

/**
 * Check if an admin role has a specific permission.
 * First checks role-based defaults, then checks custom permissions override.
 */
export function hasPermission(
  role: AdminRole,
  permission: keyof AdminPermissions,
  customPermissions?: AdminPermissions
): boolean {
  // dev_admin and super_admin always have access (except specific restrictions)
  if (role === 'dev_admin') return true;

  if (role === 'super_admin') {
    // super_admin has everything except user_management and impersonation
    if (permission === 'user_management' || permission === 'impersonation') return false;
    return true;
  }

  // Check custom permissions first (override)
  if (customPermissions && customPermissions[permission] !== undefined) {
    return customPermissions[permission] === true;
  }

  // Fall back to role defaults
  const rolePerms = ROLE_PERMISSIONS[role];
  return rolePerms?.[permission] === true;
}

/**
 * Check if one role can manage another role.
 * dev_admin can manage all roles.
 * super_admin can manage all except dev_admin.
 * Others cannot manage any roles.
 */
export function canManageRole(managerRole: AdminRole, targetRole: AdminRole): boolean {
  if (managerRole === 'dev_admin') return true;
  if (managerRole === 'super_admin' && targetRole !== 'dev_admin') return true;
  return false;
}

/**
 * Check if a role can impersonate users.
 * Only dev_admin can impersonate.
 */
export function canImpersonate(role: AdminRole): boolean {
  return role === 'dev_admin';
}

/**
 * Get the effective permissions for an admin.
 * Merges role defaults with any custom permission overrides.
 */
export function getEffectivePermissions(
  role: AdminRole,
  customPermissions?: AdminPermissions
): AdminPermissions {
  const roleDefaults = ROLE_PERMISSIONS[role] || {};
  return { ...roleDefaults, ...customPermissions };
}

/**
 * Get all permissions as a flat list (for display)
 */
export function getAllPermissionKeys(): (keyof AdminPermissions)[] {
  return [
    'courses',
    'batches',
    'students',
    'enrollments',
    'payments',
    'discounts',
    'group_bookings',
    'study_materials',
    'ai_chat',
    'email_templates',
    'reports',
    'qr_campaigns',
    'ai_spot',
    'certificates',
    'session_links',
    'user_management',
    'impersonation',
  ];
}
