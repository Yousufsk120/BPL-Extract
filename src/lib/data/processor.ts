// Bengal Political Data Processor
// Copilot: Help me create functions to process Bengal election data
import Papa from 'papaparse';
import { PoliticalData, Constituency, ElectionResult } from '@/types/political';

// TODO: Copilot will suggest data cleaning and processing functions
export class BengalDataProcessor {
  // Process CSV election data
  static processElectionCSV(csvData: string): Promise<ElectionResult[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const electionResults: ElectionResult[] = results.data.map((row: any) => ({
              year: parseInt(row.year),
              winner: row.winner || '',
              party: row.party || '',
              votes: parseInt(row.votes) || 0,
              margin: parseInt(row.margin) || 0,
              turnout_percentage: parseFloat(row.turnout_percentage) || 0
            }));
            resolve(electionResults);
          } catch (error) {
            reject(error);
          }
        },
        error: (error: any) => reject(error)
      });
    });
  }
  
  // Clean constituency names
  static normalizeConstituencyName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Calculate vote share and swings
  static calculateVoteSwing(current: ElectionResult, previous: ElectionResult): number {
    const currentShare = (current.votes / (current.votes + current.margin)) * 100;
    const previousShare = (previous.votes / (previous.votes + previous.margin)) * 100;
    return currentShare - previousShare;
  }

  // Get constituency by district
  static getConstituenciesByDistrict(constituencies: Constituency[], district: string): Constituency[] {
    return constituencies.filter(c => 
      c.district.toLowerCase().includes(district.toLowerCase())
    );
  }

  // Calculate party-wise vote share
  static calculatePartyVoteShare(results: ElectionResult[]): { [party: string]: number } {
    const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);
    const partyVotes: { [party: string]: number } = {};
    
    results.forEach(result => {
      if (!partyVotes[result.party]) {
        partyVotes[result.party] = 0;
      }
      partyVotes[result.party] += result.votes;
    });

    const voteShare: { [party: string]: number } = {};
    Object.keys(partyVotes).forEach(party => {
      voteShare[party] = (partyVotes[party] / totalVotes) * 100;
    });

    return voteShare;
  }
}