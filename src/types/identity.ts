/**
 * Types Identité, Utilisateurs & Rôles — alignés backend identity
 */

export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "pending_verification"
  | "archived";
export type UserType = "tenant" | "public" | "system" | "platform_admin";
export type MembershipType = "staff" | "patient" | "admin" | "guest";

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  phone?: string;
  tenantId?: string;
  organizationId?: string;
  roles?: string[];
  isPatient?: boolean;
  emailVerified?: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  status?: UserStatus;
}

export interface UserOrganizationDto {
  id: string;
  name: string;
  membershipType: MembershipType;
  roles: string[];
  joinedAt: string;
}

export interface UserResponseDto {
  id: string;
  keycloakId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  emailVerified: boolean;
  enabled: boolean;
  status: UserStatus;
  userType: UserType;
  tenantId?: string;
  isPatient: boolean;
  roles: string[];
  organizations: UserOrganizationDto[];
  activeSessions: number;
  createdAt?: string;
  lastLoginAt?: string;
  mfaEnabled?: boolean;
}

export interface PaginatedUsersDto {
  data: UserResponseDto[];
  total: number;
  limit: number;
  offset: number;
}

export interface CustomRoleDto {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  level?: number;
  inheritsFrom?: string[];
  status?: string;
  syncStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomRoleDto {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  level?: number;
  inheritsFrom?: string[];
  requiresApproval?: boolean;
  maxUsers?: number;
  color?: string;
  icon?: string;
  tags?: string[];
}

export interface UpdateCustomRoleDto {
  displayName?: string;
  description?: string;
  permissions?: string[];
  level?: number;
  inheritsFrom?: string[];
  requiresApproval?: boolean;
  maxUsers?: number;
  status?: string;
  color?: string;
  icon?: string;
  tags?: string[];
}

export interface PharmacyConfigItem {
  id: string;
  key: string;
  value: unknown;
  value_type?: string;
  category?: string;
  organization_id?: string;
  is_system_config?: boolean;
}

export interface TOTPStatusResponseDto {
  enabled: boolean;
  backupCodesRemaining?: number;
}

export interface TOTPSetupResponseDto {
  secret?: string;
  qrCodeUrl?: string;
  backupCodes?: string[];
}
