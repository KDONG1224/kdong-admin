// layouts
import { MainLayout } from 'layouts';

// containers
import { GuestbookList } from 'containers';

const GuestbookListPage = () => {
  return (
    <MainLayout>
      <GuestbookList />
    </MainLayout>
  );
};

export default GuestbookListPage;
