import { PaginatedResponse } from "@/Utils/request/types";

export interface Organization {
  id: string;
  name: string;
  description?: string;
  org_type: string;
  level_cache: string;
  has_children: boolean;
  active: boolean;
  parent?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationUser {
  id: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    last_login: string;
    profile_picture_url: string;
  };
  role: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type OrganizationResponse = PaginatedResponse<Organization>;
export type OrganizationUserResponse = PaginatedResponse<OrganizationUser>;
export type RoleResponse = PaginatedResponse<Role>;
