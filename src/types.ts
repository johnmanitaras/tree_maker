export interface Track {
  id: string;
  name: string;
  color: string;
  type: 'track' | 'limit';
}

export interface Node {
  id: string;
  name: string;
  tracks: string[];
  quantities: Record<string, number>;
  children: Node[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}