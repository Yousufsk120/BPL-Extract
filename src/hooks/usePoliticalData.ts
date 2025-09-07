// Custom hooks for Bengal Political Lab
import { useState, useEffect, useMemo } from 'react';
import { Constituency, ElectionResult, PoliticalData } from '@/types/political';
import { BengalDataProcessor } from '@/lib/data/processor';

// Hook for managing political data state
export function usePoliticalData() {
  const [data, setData] = useState<PoliticalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (csvData: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await BengalDataProcessor.processElectionCSV(csvData);
      // Process and structure the data here
      setData({
        constituencies: [],
        parties: [],
        elections: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, loadData };
}

// Hook for filtering constituencies
export function useConstituencyFilter(
  constituencies: Constituency[],
  district?: string,
  searchTerm?: string
) {
  return useMemo(() => {
    let filtered = constituencies;

    if (district) {
      filtered = filtered.filter(c => 
        c.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [constituencies, district, searchTerm]);
}

// Hook for calculating election statistics
export function useElectionStats(results: ElectionResult[]) {
  return useMemo(() => {
    if (!results.length) {
      return {
        totalVotes: 0,
        averageTurnout: 0,
        partyCount: 0,
        winningParty: null,
        voteShare: {}
      };
    }

    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
    const averageTurnout = results.reduce((sum, r) => sum + r.turnout_percentage, 0) / results.length;
    const voteShare = BengalDataProcessor.calculatePartyVoteShare(results);
    
    // Find winning party (highest vote share)
    const winningParty = Object.entries(voteShare).reduce((max, [party, share]) => 
      share > (max[1] || 0) ? [party, share] : max
    )[0];

    return {
      totalVotes,
      averageTurnout: Number(averageTurnout.toFixed(2)),
      partyCount: Object.keys(voteShare).length,
      winningParty,
      voteShare
    };
  }, [results]);
}

// Hook for election year comparison
export function useElectionComparison(
  results: ElectionResult[],
  year1: number,
  year2: number
) {
  return useMemo(() => {
    const results1 = results.filter(r => r.year === year1);
    const results2 = results.filter(r => r.year === year2);

    if (!results1.length || !results2.length) {
      return null;
    }

    const share1 = BengalDataProcessor.calculatePartyVoteShare(results1);
    const share2 = BengalDataProcessor.calculatePartyVoteShare(results2);

    const comparison: { [party: string]: { year1: number; year2: number; swing: number } } = {};

    const allParties = new Set([...Object.keys(share1), ...Object.keys(share2)]);

    allParties.forEach(party => {
      const y1Share = share1[party] || 0;
      const y2Share = share2[party] || 0;
      comparison[party] = {
        year1: y1Share,
        year2: y2Share,
        swing: y2Share - y1Share
      };
    });

    return comparison;
  }, [results, year1, year2]);
}

// Hook for managing selected constituency
export function useSelectedConstituency() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<Constituency | null>(null);

  const selectConstituency = (constituency: Constituency | null) => {
    setSelectedId(constituency?.id || null);
    setSelectedData(constituency);
  };

  return {
    selectedId,
    selectedData,
    selectConstituency,
    clearSelection: () => selectConstituency(null)
  };
}