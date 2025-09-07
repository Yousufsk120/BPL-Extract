// Bengal Constituency Interactive Map
// Copilot: Create an interactive map of Bengal constituencies using D3
'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Constituency } from '@/types/political';

interface ConstituencyMapProps {
  data: Constituency[];
  onConstituencyClick?: (constituency: string) => void;
}

export default function ConstituencyMap({ data, onConstituencyClick }: ConstituencyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create a simple grid-based representation of constituencies
    const cols = Math.ceil(Math.sqrt(data.length));
    const rows = Math.ceil(data.length / cols);
    const cellWidth = (width - margin.left - margin.right) / cols;
    const cellHeight = (height - margin.top - margin.bottom) / rows;

    // Color scale based on voter count
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d.voter_count) || 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create constituency rectangles
    const constituencies = g.selectAll('.constituency')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'constituency')
      .attr('transform', (d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return `translate(${col * cellWidth},${row * cellHeight})`;
      });

    constituencies.append('rect')
      .attr('width', cellWidth - 2)
      .attr('height', cellHeight - 2)
      .attr('fill', d => colorScale(d.voter_count))
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onConstituencyClick) {
          onConstituencyClick(d.name);
        }
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 3);
        
        // Tooltip
        const tooltip = d3.select('body').append('div')
          .attr('id', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '10px')
          .style('border-radius', '5px')
          .style('pointer-events', 'none')
          .style('opacity', 0);

        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`<strong>${d.name}</strong><br/>District: ${d.district}<br/>Voters: ${d.voter_count.toLocaleString()}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 1);
        d3.select('#tooltip').remove();
      });

    // Add constituency labels for larger cells
    if (cellWidth > 60 && cellHeight > 40) {
      constituencies.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', cellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10px')
        .style('fill', 'white')
        .style('pointer-events', 'none')
        .text(d => d.name.length > 10 ? d.name.substring(0, 8) + '...' : d.name);
    }

  }, [data, onConstituencyClick]);

  return (
    <div className="w-full bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Bengal Constituencies Map</h3>
      <svg
        ref={svgRef}
        width="100%"
        height="400"
        viewBox="0 0 800 400"
        className="border rounded"
      />
      <div className="mt-2 text-sm text-gray-600">
        <p>Color intensity represents voter count. Click on constituencies for details.</p>
      </div>
    </div>
  );
}