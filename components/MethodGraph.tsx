import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MethodGraphData } from '../types';
import { RefreshCw } from 'lucide-react';

interface MethodGraphProps {
  data: MethodGraphData;
}

const MethodGraph: React.FC<MethodGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    setReplayKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const colorMap: Record<string, string> = {
      dataset: '#3b82f6', // blue-500
      preprocessing: '#f59e0b', // amber-500
      model: '#ef4444', // red-500
      training: '#8b5cf6', // violet-500
      evaluation: '#10b981', // emerald-500
    };

    // Create a simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.08))
      .force("y", d3.forceY(height / 2).strength(0.08));

    // Arrow marker
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    // Links with animation
    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)")
      .attr("opacity", 0);

    link.transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("opacity", 1);

    // Nodes container
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .attr("opacity", 0);

    // Animate nodes appearing
    node.transition()
      .duration(800)
      .delay((d, i) => i * 150)
      .attr("opacity", 1);

    // Node circles with pulse effect on hover
    node.append("circle")
      .attr("r", 18)
      .attr("fill", (d: any) => colorMap[d.group] || "#94a3b8")
      .attr("cursor", "grab");

    // Node labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 22)
      .attr("y", 5)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "none")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .style("pointer-events", "none")
      .style("text-shadow", "0 2px 4px rgba(0,0,0,0.5)");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, replayKey]);

  return (
    <div className="w-full h-[500px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 p-3 rounded-lg border border-slate-700 text-xs backdrop-blur-md shadow-xl">
        <div className="font-bold mb-2 text-slate-400 uppercase tracking-wider flex justify-between items-center">
          <span>Method Pipeline</span>
          <button onClick={handleReplay} className="text-blue-400 hover:text-white transition-colors" title="Replay Animation">
            <RefreshCw size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>Dataset</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>Preprocessing</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>Model</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>Training</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>Evaluation</div>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MethodGraph;