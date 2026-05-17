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
import { deleteEvent, fetchEventById } from '../../redux/actions/eventActions';
import { formatDateTime } from '../../utils/formatters';
import { getVisibilityLabel } from '../../utils/helpers';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const event = useSelector((state) => state.events.current);
  const loading = useSelector((state) => state.events.loading);
  const { canManageNotice } = usePermission();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (loading && !event) return <Loader label="Loading event..." />;
  if (!event) return <EmptyState title="Event not found" message="The event you are looking for does not exist or is not visible to you." />;

  const canManage = canManageNotice(event);

  return (
    <PageWrapper>
      <PageHeader
        backTo="/events"
        backLabel="Back to Events"
        title={event.title || 'Event'}
        description={formatDateTime(event.dateTime)}
        actions={canManage ? (
          <>
            <Link to={`/events/${id}/edit`}><PrimaryButton><span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit</span></PrimaryButton></Link>
            <button type="button" onClick={() => setConfirmDelete(true)} className="btn-secondary inline-flex items-center gap-2 text-error">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </>
        ) : null}
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date & Time</p>
            <p className="mt-2 font-semibold text-on-surface">{event.dateTime ? formatDateTime(event.dateTime) : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Location</p>
            <p className="mt-2 font-semibold text-on-surface">{event.location || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Organizer</p>
            <p className="mt-2 font-semibold text-on-surface">{event.organizer || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Visibility</p>
            <div className="mt-2"><Badge tone="primary">{getVisibilityLabel(event)}</Badge></div>
          </div>
          {event.createdBy?.username ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Posted by</p>
              <p className="mt-2 font-semibold text-on-surface">{event.createdBy.username}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold text-on-surface">Description</h2>
        {event.description ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-on-surface-variant">{event.description}</p>
        ) : (
          <p className="mt-3 text-sm text-on-surface-variant">No description provided.</p>
        )}
      </section>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete Event"
        message="This event will be removed from the active calendar."
        confirmText="Delete"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          const result = await dispatch(deleteEvent(id));
          if (!result.error) {
            setConfirmDelete(false);
            navigate('/events');
          }
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default EventDetail;
