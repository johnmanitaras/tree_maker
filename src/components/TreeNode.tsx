// In TreeNode.tsx, modify the handleTrackToggle function to enforce parent track inheritance:

const handleTrackToggle = (trackId: string) => {
  const isActive = node.tracks.includes(trackId);
  const isAvailable = level === 0 || parentQuantities[trackId] !== undefined;
  
  if (!isAvailable && !isActive) {
    return; // Cannot add tracks not present in parent
  }

  const newTracks = isActive
    ? node.tracks.filter(id => id !== trackId)
    : [...node.tracks, trackId];
  
  // When removing a track, also remove it from all children
  const removeTrackFromChildren = (node: Node): Node => ({
    ...node,
    tracks: node.tracks.filter(id => id !== trackId),
    quantities: Object.fromEntries(
      Object.entries(node.quantities).filter(([id]) => id !== trackId)
    ),
    children: node.children.map(removeTrackFromChildren)
  });

  const updatedNode = isActive
    ? removeTrackFromChildren(node)
    : { ...node, tracks: newTracks };

  onUpdate(updatedNode);
};

// Rest of TreeNode.tsx remains the same...