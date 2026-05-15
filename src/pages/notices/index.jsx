import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { deleteNotice, fetchNotices } from '../../redux/actions/noticeActions';
import { formatDate, truncate } from '../../utils/formatters';

const Notices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const { list, loading } = useSelector((state) => state.notices);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  return (
    <PageWrapper>
      <PageHeader
        title="Notices"
        description="Publish important communication across the school, class, or section."
        actions={role !== 'student' ? <Link to="/notices/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Notice</span></PrimaryButton></Link> : null}
      />

      {loading ? <Loader label="Loading notices..." /> : null}
      {!loading && !list.length ? <EmptyState title="No notices available" message="School communication will appear here." /> : null}
      {!loading && list.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {list.map((notice) => (
            <article key={notice._id} className="glass-panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">{notice.title}</h2>
                  <p className="mt-2 text-sm text-on-surface-variant">{formatDate(notice.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={notice.isPriority ? 'error' : 'primary'}>{notice.visibility || 'notice'}</Badge>
                  {role !== 'student' ? <button type="button" onClick={() => navigate(`/notices/${notice._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button> : null}
                  {role !== 'student' ? <button type="button" onClick={() => setDeleteId(notice._id)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button> : null}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">{truncate(notice.content, 220)}</p>
            </article>
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Notice"
        message="This notice will be removed from active circulation."
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          const result = await dispatch(deleteNotice(deleteId));
          if (!result.error) setDeleteId(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Notices;
