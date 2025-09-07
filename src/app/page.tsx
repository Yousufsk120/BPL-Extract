'use client';
import React, { useState, useEffect } from 'react';
import ConstituencyMap from '@/components/charts/ConstituencyMap';
import PartyVoteShare from '@/components/charts/PartyVoteShare';
import ElectionTrends from '@/components/charts/ElectionTrends';
import { Constituency, ElectionResult, Party } from '@/types/political';
import { BengalDataProcessor } from '@/lib/data/processor';

// Sample data for demonstration
const sampleConstituencies: Constituency[] = [
  {
    id: '1',
    name: 'Kolkata Uttar',
    district: 'Kolkata',
    assembly_segment: 'Kolkata North',
    voter_count: 180000,
    results: [
      { year: 2021, winner: 'Sudip Bandyopadhyay', party: 'AITC', votes: 95000, margin: 12000, turnout_percentage: 75.2 },
      { year: 2019, winner: 'Sudip Bandyopadhyay', party: 'AITC', votes: 92000, margin: 8000, turnout_percentage: 72.1 }
    ]
  },
  {
    id: '2',
    name: 'Howrah',
    district: 'Howrah',
    assembly_segment: 'Howrah',
    voter_count: 195000,
    results: [
      { year: 2021, winner: 'Prasun Banerjee', party: 'AITC', votes: 105000, margin: 18000, turnout_percentage: 78.5 },
      { year: 2019, winner: 'Prasun Banerjee', party: 'AITC', votes: 98000, margin: 15000, turnout_percentage: 74.8 }
    ]
  },
  {
    id: '3',
    name: 'Asansol',
    district: 'Paschim Bardhaman',
    assembly_segment: 'Asansol Uttar',
    voter_count: 210000,
    results: [
      { year: 2021, winner: 'Shatrughan Sinha', party: 'AITC', votes: 88000, margin: 5000, turnout_percentage: 65.3 },
      { year: 2019, winner: 'Babul Supriyo', party: 'BJP', votes: 95000, margin: 12000, turnout_percentage: 68.9 }
    ]
  },
  {
    id: '4',
    name: 'Durgapur',
    district: 'Paschim Bardhaman',
    assembly_segment: 'Durgapur Purba',
    voter_count: 175000,
    results: [
      { year: 2021, winner: 'Kirti Azad', party: 'AITC', votes: 85000, margin: 7000, turnout_percentage: 70.2 },
      { year: 2019, winner: 'S.S. Ahluwalia', party: 'BJP', votes: 89000, margin: 11000, turnout_percentage: 72.5 }
    ]
  },
  {
    id: '5',
    name: 'Darjeeling',
    district: 'Darjeeling',
    assembly_segment: 'Darjeeling',
    voter_count: 145000,
    results: [
      { year: 2021, winner: 'Raju Bista', party: 'BJP', votes: 78000, margin: 22000, turnout_percentage: 82.1 },
      { year: 2019, winner: 'Raju Bista', party: 'BJP', votes: 85000, margin: 28000, turnout_percentage: 85.3 }
    ]
  },
  {
    id: '6',
    name: 'Malda Uttar',
    district: 'Malda',
    assembly_segment: 'Malda',
    voter_count: 165000,
    results: [
      { year: 2021, winner: 'Khagen Murmu', party: 'AITC', votes: 72000, margin: 3000, turnout_percentage: 68.9 },
      { year: 2019, winner: 'Mausam Noor', party: 'INC', votes: 75000, margin: 8000, turnout_percentage: 71.2 }
    ]
  }
];

const sampleParties: Party[] = [
  { code: 'AITC', name: 'All India Trinamool Congress', color: '#20C997' },
  { code: 'BJP', name: 'Bharatiya Janata Party', color: '#FF9933' },
  { code: 'INC', name: 'Indian National Congress', color: '#19AAED' },
  { code: 'CPM', name: 'Communist Party of India (Marxist)', color: '#DC143C' },
  { code: 'CPI', name: 'Communist Party of India', color: '#FF0000' }
];

export default function Home() {
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<ElectionResult[]>([]);

  useEffect(() => {
    // Flatten all election results for charts
    const results: ElectionResult[] = [];
    sampleConstituencies.forEach(constituency => {
      if (constituency.results) {
        results.push(...constituency.results);
      }
    });
    setAllResults(results);
  }, []);

  const handleConstituencyClick = (constituencyName: string) => {
    setSelectedConstituency(constituencyName);
    console.log('Clicked constituency:', constituencyName);
  };

  const totalVoters = sampleConstituencies.reduce((sum, c) => sum + c.voter_count, 0);
  const totalConstituencies = sampleConstituencies.length;
  const latestElectionResults = allResults.filter(r => r.year === 2021);
  const averageTurnout = latestElectionResults.length > 0 
    ? latestElectionResults.reduce((sum, r) => sum + r.turnout_percentage, 0) / latestElectionResults.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Bengal Political Lab</h1>
        <p className="text-xl opacity-90">
          Advanced Political Intelligence Platform for Bengal
        </p>
        <p className="text-lg opacity-75 mt-2">
          Data extraction, sentiment analysis, and election prediction system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3>Total Constituencies</h3>
          <p>{totalConstituencies}</p>
          <span>Sample data loaded</span>
        </div>
        <div className="stat-card">
          <h3>Total Voters</h3>
          <p>{totalVoters.toLocaleString()}</p>
          <span>Registered voters</span>
        </div>
        <div className="stat-card">
          <h3>Average Turnout</h3>
          <p>{averageTurnout.toFixed(1)}%</p>
          <span>2021 Elections</span>
        </div>
        <div className="stat-card">
          <h3>Active Parties</h3>
          <p>{sampleParties.length}</p>
          <span>Major political parties</span>
        </div>
      </div>

      {/* Selected Constituency Info */}
      {selectedConstituency && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Selected Constituency:</strong> {selectedConstituency}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Constituency Map */}
        <div className="lg:col-span-2">
          <ConstituencyMap 
            data={sampleConstituencies} 
            onConstituencyClick={handleConstituencyClick}
          />
        </div>

        {/* Party Vote Share */}
        <PartyVoteShare 
          results={latestElectionResults}
          title="2021 Election Results - Vote Share"
        />

        {/* Election Trends */}
        <ElectionTrends 
          results={allResults}
          parties={['AITC', 'BJP', 'INC']}
          title="Party Performance Trends"
        />
      </div>

      {/* Data Processing Demo */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Data Processing Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900">CSV Processing</h4>
            <p className="text-sm text-gray-600 mt-1">
              Automated election data import and normalization from CSV files
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900">Constituency Analysis</h4>
            <p className="text-sm text-gray-600 mt-1">
              Vote swing calculations and constituency-wise performance metrics
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900">Real-time Visualization</h4>
            <p className="text-sm text-gray-600 mt-1">
              Interactive charts and maps for comprehensive political analysis
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 text-sm">
        <p>Bengal Political Lab - Powered by Next.js, TypeScript, and D3.js</p>
        <p className="mt-1">🤖 Optimized for GitHub Copilot development</p>
      </div>
    </div>
  );
}