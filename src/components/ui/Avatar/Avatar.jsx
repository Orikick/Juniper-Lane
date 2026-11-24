import { cx } from '../../../utils/cx';
import { getInitials } from '../../../utils/formatters';
import styles from './Avatar.module.scss';

const TONES = ['teal', 'violet', 'amber', 'blue'];

// The same name always gets the same tone.
function toneFor(name) {
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) % 997;
  return TONES[hash % TONES.length];
}

// Initials on a tinted circle. Decorative: the person's name is always shown next to it.
export default function Avatar({ name = '', size = 'md', className }) {
  return (
    <span
      className={cx(styles.avatar, styles[size], styles[toneFor(name)], className)}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
