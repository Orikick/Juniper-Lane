import { getProfile } from '../../api/fakeApi';
import PreferencesPanel from '../../components/settings/PreferencesPanel/PreferencesPanel';
import ProfileForm from '../../components/settings/ProfileForm/ProfileForm';
import Card from '../../components/ui/Card/Card';
import PageHeader from '../../components/ui/PageHeader/PageHeader';
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import StateMessage from '../../components/ui/StateMessage/StateMessage';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import styles from './Settings.module.scss';

export default function Settings() {
  useDocumentTitle('Settings');
  const { status, data, reload } = useAsync(getProfile);

  return (
    <>
      <PageHeader title="Settings" description="Your profile, notifications and display preferences." />

      <div className={styles.layout}>
        {status === 'loading' && <ProfileSkeleton />}
        {status === 'error' && (
          <Card>
            <StateMessage
              tone="error"
              title="Your profile could not be loaded"
              description="The request failed. Check your connection and try again."
              actionLabel="Try again"
              onAction={reload}
            />
          </Card>
        )}
        {status === 'success' && <ProfileForm profile={data} />}

        <PreferencesPanel />
      </div>
    </>
  );
}

function ProfileSkeleton() {
  return (
    <Card className={styles.skeleton}>
      <div role="status">
        <span className="sr-only">Loading your profile</span>
      </div>
      <Skeleton width={120} height={20} />
      <div className={styles.skeletonGrid} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={styles.skeletonField}>
            <Skeleton width="40%" height={14} />
            <Skeleton height={40} />
          </div>
        ))}
      </div>
      <Skeleton height={96} />
    </Card>
  );
}
