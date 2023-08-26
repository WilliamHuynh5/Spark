export enum Permission {
  SITE_ADMIN = 'site admin',
  MEMBER = 'member',
}

export enum PermissionLevel {
  SITE_ADMIN = 1,
  MEMBER = 2,
}

// Conversion function from Permission to PermissionLevel
export function permissionToPermissionLevel(
  permission: Permission,
): PermissionLevel {
  switch (permission) {
    case Permission.SITE_ADMIN:
      return PermissionLevel.SITE_ADMIN;
    case Permission.MEMBER:
      return PermissionLevel.MEMBER;
    default:
      throw new Error('Invalid site permission value');
  }
}

export enum SocietyPermission {
  ADMIN = 'Administrator',
  MODERATOR = 'Moderator',
  MEMBER = 'Member',
}

export enum SocietyPermissionLevel {
  ADMIN = 1,
  MODERATOR = 2,
  MEMBER = 3,
}

export function stringToSocietyPermission(
  permission: string,
): SocietyPermission {
  switch (permission) {
    case 'admin':
      return SocietyPermission.ADMIN;
    case 'moderator':
      return SocietyPermission.MODERATOR;
    case 'member':
      return SocietyPermission.MEMBER;
    default:
      throw new Error('Invalid society permission value');
  }
}

export function societyPermissionToPermissionLevel(
  permission: SocietyPermission,
): SocietyPermissionLevel {
  switch (permission) {
    case SocietyPermission.ADMIN:
      return SocietyPermissionLevel.ADMIN;
    case SocietyPermission.MODERATOR:
      return SocietyPermissionLevel.MODERATOR;
    case SocietyPermission.MEMBER:
      return SocietyPermissionLevel.MEMBER;
    default:
      throw new Error('Invalid society permission value');
  }
}

export interface UserToDisplay {
  id: number;
  name: string;
  zId: string;
  email: string;
  permissions: Permission;
  originalPermissions: Permission;
}

export interface MemberToDisplay {
  userId: number;
  name: string;
  zId: string;
  permissions: SocietyPermission;
  originalPermissions: SocietyPermission;
}
