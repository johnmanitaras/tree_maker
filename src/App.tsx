// Previous App.tsx content remains the same, but add deleteTrack handler:

function App() {
  // ... existing state ...

  const handleDeleteTrack = (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track? This will remove it from all nodes.')) {
      return;
    }

    // Remove track from all nodes recursively
    const removeTrackFromNode = (node: Node): Node => ({
      ...node,
      tracks: node.tracks.filter(id => id !== trackId),
      quantities: Object.fromEntries(
        Object.entries(node.quantities).filter(([id]) => id !== trackId)
      ),
      children: node.children.map(removeTrackFromNode)
    });

    setTracks(tracks.filter(t => t.id !== trackId));
    if (tree) {
      setTree(removeTrackFromNode(tree));
    }
  };

  // In the tracks section of the header, modify the track buttons to include delete:
  {tracks.map(track => (
    <div key={track.id} className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm">
      <div
        className="h-4 w-4 rounded-full"
        style={{ backgroundColor: track.color }}
      />
      <span className="text-sm font-medium">
        {track.type === 'limit' ? '⚡' : '●'} {track.name}
      </span>
      <button
        onClick={() => handleDeleteTrack(track.id)}
        className="p-1 hover:bg-red-50 rounded-full"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  ))}

  // Rest of App.tsx remains the same...
}