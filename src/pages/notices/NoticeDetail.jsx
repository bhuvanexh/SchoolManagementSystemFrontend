import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Badge from '../../components/data-display/Badge';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import usePermission from '../../hooks/usePermission';
import { deleteNotice, fetchNoticeById } from '../../redux/actions/noticeActions';
import { formatDate } from '../../utils/formatters';
import { getVisibilityLabel } from '../../utils/helpers';

const NoticeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notice = useSelector((state) => state.notices.current);
  const loading = useSelector((state) => state.notices.loading);
  const { canManageNotice } = usePermission();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchNoticeById(id));
  }, [dispatch, id]);

  if (loading && !notice) return <Loader label="Loading notice..." />;
  if (!notice) return <EmptyState title="Notice not found" message="The notice you are looking for does not exist or is not visible to you." />;

  const canManage = canManageNotice(notice);
  const postedBy = notice.createdBy?.username;
  const postedRole = notice.createdBy?.role;

  return (
    <PageWrapper>
      <PageHeader
        backTo="/notices"
        backLabel="Back to Notices"
        title={notice.title || 'Notice'}
        description={notice.createdAt ? `Posted on ${formatDate(notice.createdAt)}` : null}
        actions={canManage ? (
          <>
            <Link to={`/notices/${id}/edit`}><PrimaryButton><span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit</span></PrimaryButton></Link>
            <button type="button" onClick={() => setConfirmDelete(true)} className="btn-secondary inline-flex items-center gap-2 text-error">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </>
        ) : null}
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Visibility</p>
            <div className="mt-2 inline-flex items-center gap-2">
              <Badge tone="primary">{getVisibilityLabel(notice)}</Badge>
              {notice.isPriority ? <Badge tone="error">Priority</Badge> : null}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Posted by</p>
            <p className="mt-2 font-semibold text-on-surface">{postedBy || '—'}{postedRole ? ` (${postedRole})` : ''}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Posted on</p>
            <p className="mt-2 font-semibold text-on-surface">{notice.createdAt ? formatDate(notice.createdAt) : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Expires</p>
            <p className="mt-2 font-semibold text-on-surface">{notice.expiresAt ? formatDate(notice.expiresAt) : 'No expiry'}</p>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold text-on-surface">Notice</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-on-surface-variant">{notice.content || 'No content.'}</p>
      </section>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete Notice"
        message="This notice will be removed from active circulation."
        confirmText="Delete"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          const result = await dispatch(deleteNotice(id));
          if (!result.error) {
            setConfirmDelete(false);
            navigate('/notices');
          }
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default NoticeDetail;
