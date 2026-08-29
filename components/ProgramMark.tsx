import {
  Droplets,
  GraduationCap,
  HandHeart,
  Home,
  Store,
  type LucideIcon,
} from 'lucide-react';

const programIcons: Record<string, LucideIcon> = {
  'berbagi-rasa': HandHeart,
  merakyat: Store,
  rehat: Home,
  'berbagi-air-bersih': Droplets,
  'berbagi-masa-depan': GraduationCap,
};

export function ProgramMark({
  slug,
  accent,
  compact = false,
}: {
  slug: string;
  accent: string;
  compact?: boolean;
}) {
  const Icon = programIcons[slug] ?? HandHeart;

  return (
    <span className={`program-mark program-mark-${slug} ${compact ? 'program-mark-compact' : ''}`} aria-hidden="true">
      <span className="program-mark-orbit" />
      <Icon size={compact ? 18 : 28} strokeWidth={1.8} />
      <strong>{accent}</strong>
    </span>
  );
}
