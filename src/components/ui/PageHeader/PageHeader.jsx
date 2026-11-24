import styles from './PageHeader.module.scss';

export default function PageHeader({ title, description, children }) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}
