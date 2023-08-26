export type Empty = Record<string, never>;

export type TokenType = string;

export interface TokenInfo {
  token: TokenType;
}

export interface ApplicationInfo {
  applicationId: number;
}

export interface Application {
  applicationId: number;
  name: string;
  status: string;
  description: string;
  applicantId: string;
}

export interface ApplicationsListInfo {
  applications: Application[];
}

export interface SocietyInfo {
  societyId: number;
}

export interface Society {
  societyId: number;
  societyName: string;
  description: string;
  photoURL: string;
}

export interface SocietyListInfo {
  societies: Society[];
}

export interface Profile {
  id: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  zId: string;
  adminSocieties: number[];
  modSocieties: number[];
  isSiteAdmin: boolean;
  webcal: string;
}

export interface User {
  id: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  zId: string;
  adminSocieties: number[];
  modSocieties: number[];
  isAdmin: boolean;
  webcal: string;
}

export interface UserListInfo {
  users: User[];
}

export interface SocietyMember {
  userId: number;
  zId: string;
  nameFirst: string;
  nameLast: string;
  role: string;
}

export interface SocietyMemberListInfo {
  members: SocietyMember[];
}

export interface EventInfo {
  eventId: number;
}

export interface Events {
  events: Event[];
}

export interface Event {
  eventId: number;
  name: string;
  description: string;
  time: string; // util.format(Date())
  location: string;
  societyId: number;
}

export interface AttendingStatus {
  attending: boolean;
}

export interface ProfileEvents {
  attending: Event[];
  attended: Event[];
}

export interface ProfileSocieties {
  societies: Society[];
}
