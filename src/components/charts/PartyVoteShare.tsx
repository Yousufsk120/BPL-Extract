// Party Vote Share Chart
'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ElectionResult } from '@/types/political';
import { BengalDataProcessor } from '@/lib/data/processor';

interface PartyVoteShareProps {
  results: ElectionResult[];
  title?: string;
}

export default function PartyVoteShare({ results, title = "Party-wise Vote Share" }: PartyVoteShareProps) {
  const voteShareData = React.useMemo(() => {
    const shareData = BengalDataProcessor.calculatePartyVoteShare(results);
    return Object.entries(shareData).map(([party, share]) => ({
      party,
      share: Number(share.toFixed(2)),
      votes: results.filter(r => r.party === party).reduce((sum, r) => sum + r.votes, 0)
    })).sort((a, b) => b.share - a.share);
  }, [results]);

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      'BJP': '#FF9933',
      'INC': '#19AAED',
      'AITC': '#20C997',
      'CPM': '#DC143C',
      'CPI': '#FF0000',
      'AAP': '#0066FF',
      'BSP': '#22409A',
      'SP': '#FF2222'
    };
    return colors[party] || '#8884d8';
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={voteShareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="party" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Vote Share (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value}%`,
              'Vote Share'
            ]}
            labelFormatter={(label: string) => `Party: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="share" 
            fill={(entry: any) => getPartyColor(entry.party)}
            name="Vote Share (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}