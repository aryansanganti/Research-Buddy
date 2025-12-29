import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MethodGraphData } from '../types';
import { RefreshCw } from 'lucide-react';

interface MethodGraphProps {
  data: MethodGraphData;
}

const MethodGraph: React.FC<MethodGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    setReplayKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

    const updateGraph = () => {
      const container = containerRef.current;
      if (!container) return null;
      
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 400;
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const colorMap: Record<string, string> = {
        dataset: '#10b981',
        preprocessing: '#f59e0b',
        model: '#ef4444',
        training: '#8b5cf6',
        evaluation: '#10b981',
      };

      const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
        .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1));

      svg.append("defs").selectAll("marker")
        .data(["end"])
        .enter().append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 24)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#475569");

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
        .duration(800)
        .delay((d, i) => i * 80)
        .attr("opacity", 1);

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

      node.transition()
        .duration(600)
        .delay((d, i) => i * 100)
        .attr("opacity", 1);

      node.append("circle")
        .attr("r", 16)
        .attr("fill", (d: any) => colorMap[d.group] || "#94a3b8")
        .attr("cursor", "grab");

      node.append("text")
        .text((d: any) => d.label)
        .attr("x", 20)
        .attr("y", 4)
        .attr("fill", "#e2e8f0")
        .attr("stroke", "none")
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .style("pointer-events", "none")
        .style("text-shadow", "0 1px 3px rgba(0,0,0,0.5)");

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

      return simulation;
    };

    const simulation = updateGraph();

    let resizeTimeout: any;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        simulation?.stop();
        updateGraph();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      simulation?.stop();
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [data, replayKey]);

  return (
    <div ref={containerRef} className="w-full h-[350px] lg:h-[500px] bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden relative">
      <div className="absolute top-3 left-3 z-10 bg-slate-900/95 backdrop-blur p-2.5 rounded-xl border border-white/10 text-xs shadow-lg">
        <div className="font-bold mb-2 text-slate-400 uppercase tracking-wider flex justify-between items-center gap-4">
          <span>Legend</span>
          <button onClick={handleReplay} className="text-emerald-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10" title="Replay">
            <RefreshCw size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-slate-300">Dataset</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-slate-300">Preprocessing</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-slate-300">Model</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500"></div><span className="text-slate-300">Training</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-300">Evaluation</span></div>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MethodGraph;