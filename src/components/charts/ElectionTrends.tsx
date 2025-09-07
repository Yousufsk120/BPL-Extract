// Election Trends Chart
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ElectionResult } from '@/types/political';

interface ElectionTrendsProps {
  results: ElectionResult[];
  parties?: string[];
  title?: string;
}

export default function ElectionTrends({ results, parties, title = "Election Trends Over Time" }: ElectionTrendsProps) {
  const trendData = React.useMemo(() => {
    // Group results by year
    const yearlyData: { [year: number]: { [party: string]: number } } = {};
    
    results.forEach(result => {
      if (!yearlyData[result.year]) {
        yearlyData[result.year] = {};
      }
      if (!yearlyData[result.year][result.party]) {
        yearlyData[result.year][result.party] = 0;
      }
      yearlyData[result.year][result.party] += result.votes;
    });

    // Calculate percentages for each year
    const trendArray = Object.entries(yearlyData).map(([year, partyVotes]) => {
      const totalVotes = Object.values(partyVotes).reduce((sum, votes) => sum + votes, 0);
      const yearData: any = { year: parseInt(year) };
      
      Object.entries(partyVotes).forEach(([party, votes]) => {
        yearData[party] = ((votes / totalVotes) * 100).toFixed(2);
      });
      
      return yearData;
    }).sort((a, b) => a.year - b.year);

    return trendArray;
  }, [results]);

  const allParties = React.useMemo(() => {
    const partySet = new Set<string>();
    results.forEach(result => partySet.add(result.party));
    return Array.from(partySet).sort();
  }, [results]);

  const displayParties = parties || allParties.slice(0, 6); // Show top 6 parties by default

  const getPartyColor = (party: string, index: number) => {
    const colors = [
      '#FF9933', '#19AAED', '#20C997', '#DC143C', '#FF0000', '#0066FF',
      '#22409A', '#FF2222', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'
    ];
    const partyColors: { [key: string]: string } = {
      'BJP': '#FF9933',
      'INC': '#19AAED',
      'AITC': '#20C997',
      'CPM': '#DC143C',
      'CPI': '#FF0000',
      'AAP': '#0066FF',
      'BSP': '#22409A',
      'SP': '#FF2222'
    };
    return partyColors[party] || colors[index % colors.length];
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year"
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis 
            label={{ value: 'Vote Share (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: any, name: string) => [`${parseFloat(value).toFixed(2)}%`, name]}
            labelFormatter={(label: any) => `Year: ${label}`}
          />
          <Legend />
          {displayParties.map((party, index) => (
            <Line
              key={party}
              type="monotone"
              dataKey={party}
              stroke={getPartyColor(party, index)}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 text-sm text-gray-600">
        <p>Showing vote share trends for selected parties over election years.</p>
      </div>
    </div>
  );
}