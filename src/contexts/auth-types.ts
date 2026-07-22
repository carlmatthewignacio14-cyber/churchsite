export type ChurchRole = 'New' | 'Members' | 'Leaders' | 'Pastors';

export interface ChurchUserSession {
  id: string;
  email: string;
  role: ChurchRole;
}
