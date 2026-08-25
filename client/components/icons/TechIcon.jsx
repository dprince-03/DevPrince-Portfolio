import {
  SiGo,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiGin,
  SiNextdotjs,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiRender,
  SiNginx,
  SiGit,
  SiGithub,
  SiPostman,
  SiLinux,
  SiSentry,
  SiUmami,
} from "react-icons/si";
import { FaAws, FaWindows, FaJava } from "react-icons/fa6";
import { VscVscode, VscCode } from "react-icons/vsc";

// Skill name (as stored, case-insensitive) -> icon component. Anything not
// listed here falls back to a generic code glyph rather than rendering
// nothing, so a newly-added skill without a mapped brand icon still shows up.
const ICONS = {
  go: SiGo,
  javascript: SiJavascript,
  java: FaJava,
  react: SiReact,
  "react.js": SiReact,
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  "express.js": SiExpress,
  express: SiExpress,
  gin: SiGin,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  mongodb: SiMongodb,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  redis: SiRedis,
  docker: SiDocker,
  aws: FaAws,
  render: SiRender,
  nginx: SiNginx,
  git: SiGit,
  github: SiGithub,
  gitops: SiGit,
  postman: SiPostman,
  "vs code": VscVscode,
  vscode: VscVscode,
  windows: FaWindows,
  linux: SiLinux,
  ubuntu: SiLinux,
  sentry: SiSentry,
  umami: SiUmami,
};

export default function TechIcon({ name, className = "" }) {
  const Icon = ICONS[name.toLowerCase().trim()] || VscCode;
  return <Icon className={className} />;
}
