export enum RoleName {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum Permission {
  BASIC = 1,
  VIEW = 2,
  ADD = 4,
  EDIT = 8,
  OWNER = 128,
}

export enum ProfileRole {
  OWNER = 128,
  EDITOR = 8,
  CONTRIBUTOR = 4,
  VIEWER = 2,
}
