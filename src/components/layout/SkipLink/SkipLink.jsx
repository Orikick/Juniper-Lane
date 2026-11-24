import styles from './SkipLink.module.scss';

// First focusable element on the page. Lets keyboard users jump past the navigation.
export default function SkipLink() {
  return (
    <a className={styles.link} href="#main-content">
      Skip to main content
    </a>
  );
}
