// Bengal Political Data Types - Copilot will suggest completions based on these
export interface Constituency {
  id: string;
  name: string;
  district: string;
  assembly_segment: string;
  voter_count: number;
  results?: ElectionResult[];
}

export interface ElectionResult {
  year: number;
  winner: string;
  party: string;
  votes: number;
  margin: number;
  turnout_percentage: number;
}

export interface PoliticalData {
  constituencies: Constituency[];
  parties: Party[];
  elections: Election[];
}

export interface Party {
  code: string;
  name: string;
  color: string;
}

export interface Election {
  year: number;
  type: 'assembly' | 'lok_sabha' | 'panchayat';
  date: string;
}