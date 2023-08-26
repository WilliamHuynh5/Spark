export interface UserRegister {
  email: string;
  nameFirst: string;
  nameLast: string;
  password: string;
  zId: string;
}

export interface UserProfile {
  userId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  zId: string;
  webcal: string; // (link)
  adminSocieties: number[];
  modSocieties: number[];
  isSiteAdmin: boolean;
}

export interface User {
  id: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  zId: string;
  isAdmin: boolean;
}

export interface UserList {
  users: User[];
}

export interface Society {
  societyId: number;
  societyName: string;
  description: string;
  photoURL: string;
}

export interface Societies {
  societies: Society[];
}

export interface SocMember {
  userId: number;
  zId: string;
  nameFirst: string;
  nameLast: string;
  role: string;
}

export interface SocMembers {
  members: SocMember[];
}

export interface Event {
  eventId: number;
  name: string;
  description: string;
  time: Date;
  location: string;
  societyId: number;
}

export interface Events {
  events: Event[];
}

export interface ProfileSocieties {
  societies: Society[];
}
