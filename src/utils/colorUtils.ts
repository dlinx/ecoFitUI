// Color mapping for visual display
export const getColorValue = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'yellow': '#FFFF00',
    'purple': '#800080',
    'orange': '#FFA500',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'gray': '#808080',
    'navy': '#000080',
    'olive': '#808000',
    'teal': '#008080',
    'maroon': '#800000',
    'lime': '#00FF00',
    'aqua': '#00FFFF',
    'silver': '#C0C0C0',
    'fuchsia': '#FF00FF',
    'coral': '#FF7F50',
    'indigo': '#4B0082',
    'violet': '#EE82EE',
    'gold': '#FFD700',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
    'charcoal': '#36454F',
    'burgundy': '#800020',
    'emerald': '#50C878',
    'sapphire': '#0F52BA',
    'ruby': '#E0115F',
    'amber': '#FFBF00',
    'jade': '#00A86B',
    'turquoise': '#40E0D0',
    'crimson': '#DC143C',
    'magenta': '#FF00FF',
    'cyan': '#00FFFF',
    'lime green': '#32CD32',
    'forest green': '#228B22',
    'royal blue': '#4169E1',
    'sky blue': '#87CEEB',
    'hot pink': '#FF69B4',
    'deep pink': '#FF1493',
    'light blue': '#ADD8E6',
    'dark blue': '#00008B',
    'light green': '#90EE90',
    'dark green': '#006400',
    'light red': '#FFB6C1',
    'dark red': '#8B0000',
    'light yellow': '#FFFFE0',
    'dark yellow': '#B8860B',
    'light purple': '#E6E6FA',
    'dark purple': '#483D8B',
    'light orange': '#FFE4B5',
    'dark orange': '#FF8C00',
    'light pink': '#FFC0CB',
    'dark pink': '#FF1493',
    'light brown': '#DEB887',
    'dark brown': '#654321',
    'light gray': '#D3D3D3',
    'dark gray': '#404040',
  };

  const normalizedName = colorName.toLowerCase().trim();
  return colorMap[normalizedName] || '#CCCCCC'; // Default gray if color not found
}; 