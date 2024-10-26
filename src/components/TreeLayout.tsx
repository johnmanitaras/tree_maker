import React, { useEffect, useRef, useState } from 'react';
import { type Node, type Track } from '../types';
import TreeNode from './TreeNode';

interface TreeLayoutProps {
  tree: Node;
  tracks: Track[];
  onUpdate: (tree: Node) => void;
}

const LEVEL_HEIGHT = 250; // Increased for better spacing
const NODE_WIDTH = 300;
const NODE_HEIGHT = 150;
const NODE_HORIZONTAL_SPACING = 60; // Increased for better spacing

function calculateLayout(node: Node, level: number = 0): Node {
  const children = node.children;
  const totalWidth = children.length * (NODE_WIDTH + NODE_HORIZONTAL_SPACING) - NODE_HORIZONTAL_SPACING;
  const startX = -(totalWidth / 2);

  const processedChildren = children.map((child, index) => {
    const childX = startX + index * (NODE_WIDTH + NODE_HORIZONTAL_SPACING);
    return calculateLayout({
      ...child,
      x: childX,
      y: LEVEL_HEIGHT,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    }, level + 1);
  });

  return {
    ...node,
    children: processedChildren,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    x: node.x || 0,
    y: node.y || 0
  };
}

export default function TreeLayout({ tree, tracks, onUpdate }: TreeLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutTree, setLayoutTree] = useState<Node>(tree);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calculateDimensions = () => {
      if (!containerRef.current) return;
      
      // Calculate the layout starting from the center
      const layoutResult = calculateLayout({
        ...tree,
        x: 0,
        y: 0
      });

      // Calculate bounds
      let minX = 0, maxX = 0, maxY = 0;
      const traverse = (node: Node) => {
        minX = Math.min(minX, (node.x || 0));
        maxX = Math.max(maxX, (node.x || 0) + NODE_WIDTH);
        maxY = Math.max(maxY, (node.y || 0) + NODE_HEIGHT);
        node.children.forEach(traverse);
      };
      traverse(layoutResult);

      // Add padding
      const width = maxX - minX + 100;
      const height = maxY + 100;

      // Center the tree
      const centerOffset = width / 2;
      const centeredLayout = {
        ...layoutResult,
        x: centerOffset
      };

      setLayoutTree(centeredLayout);
      setDimensions({ width, height });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [tree]);

  const drawConnections = () => {
    const connections: JSX.Element[] = [];
    
    const addConnection = (parent: Node, child: Node, index: number) => {
      const startX = (parent.x || 0) + NODE_WIDTH / 2;
      const startY = (parent.y || 0) + NODE_HEIGHT;
      const endX = (child.x || 0) + NODE_WIDTH / 2;
      const endY = (child.y || 0);

      connections.push(
        <path
          key={`${parent.id}-${child.id}`}
          d={`M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`}
          stroke="#94a3b8"
          strokeWidth="2"
          fill="none"
        />
      );
    };

    const traverse = (node: Node) => {
      node.children.forEach((child, index) => {
        addConnection(node, child, index);
        traverse(child);
      });
    };

    traverse(layoutTree);
    return connections;
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-auto"
      style={{ 
        width: '100%',
        height: '100%',
        minHeight: '600px'
      }}
    >
      <div
        className="relative"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`
        }}
      >
        <svg
          className="absolute inset-0"
          width={dimensions.width}
          height={dimensions.height}
          style={{ pointerEvents: 'none' }}
        >
          {drawConnections()}
        </svg>
        <TreeNode
          node={layoutTree}
          tracks={tracks}
          onUpdate={onUpdate}
          parentQuantities={{}}
          level={0}
        />
      </div>
    </div>
  );
}