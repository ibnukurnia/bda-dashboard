'use client';

import { User, UserRole } from "@/types/user";

export type FeatureFlagName = keyof typeof FEATURE_FLAGS

type FeatureFlagRule = { userRoles: UserRole[] }

export const FEATURE_FLAGS = {
  GENERAL_FEATURE: true,
  USER_MANAGEMENT: [
    { userRoles: ["Admin"] },
  ],
} as const satisfies Record<string, FeatureFlagRule[] | boolean>

export function canViewFeature(featureName: FeatureFlagName, user: User) {
  const rules = FEATURE_FLAGS[featureName]
  if (typeof rules === "boolean") return rules
  return rules.some(rule => checkRule(rule, user))
}

function checkRule(
  { userRoles }: FeatureFlagRule,
  user: User
) {
  return (
    userHasValidRole(userRoles, user.role)
  )
}

function userHasValidRole(
  allowedRoles: UserRole[] | undefined,
  userRole: UserRole
) {
  return allowedRoles == null || allowedRoles.includes(userRole)
}
