import {
  SiSharp,
  SiDotnet,
  SiReact,
  SiJavascript,
  SiCss,
  SiHtml5,
  SiGit,
  SiGithub,
} from 'react-icons/si';
import { FaDatabase } from 'react-icons/fa';

// Icon + brand color for each skill shown in the TechOrbit rings.
export const TECH_ICONS = {
  'C#': { Icon: SiSharp, color: '#a179dc' },
  Dotnet: { Icon: SiDotnet, color: '#7c4dff' },
  SQL: { Icon: FaDatabase, color: '#3fa9f5' },
  React: { Icon: SiReact, color: '#61dafb' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  CSS: { Icon: SiCss, color: '#663399' },
  GitHub: { Icon: SiGithub, color: '#e6edf3' },
  HTML: { Icon: SiHtml5, color: '#e34f26' },
  Git: { Icon: SiGit, color: '#f05032' },
};

// Used for any skill without an explicit entry above.
export const TECH_ICON_FALLBACK = { Icon: FaDatabase, color: '#8b949e' };
