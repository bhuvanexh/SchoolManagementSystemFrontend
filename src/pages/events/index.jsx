import { Eye, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import Tooltip from '../../components/data-display/Tooltip';
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
import usePermission from '../../hooks/usePermission';
import { deleteEvent, fetchEvents } from '../../redux/actions/eventActions';
import { formatDateTime, truncate } from '../../utils/formatters';
import { getVisibilityLabel } from '../../utils/helpers';

const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const { canCreateNoticeOrEvent, canManageNotice } = usePermission();
  const { list, loading } = useSelector((state) => state.events);
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents({ upcoming: upcomingOnly }));
  }, [dispatch, upcomingOnly]);

  return (
    <PageWrapper>
      <PageHeader
        title="Events"
        description="Coordinate upcoming school activities, class events, and section-specific schedules."
        actions={role !== 'student' && canCreateNoticeOrEvent ? <Link to="/events/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Event</span></PrimaryButton></Link> : null}
      />

      <div className="flex items-center gap-3">
        <button type="button" className={upcomingOnly ? 'btn-primary' : 'btn-secondary'} onClick={() => setUpcomingOnly(true)}>Upcoming</button>
        <button type="button" className={!upcomingOnly ? 'btn-primary' : 'btn-secondary'} onClick={() => setUpcomingOnly(false)}>All Events</button>
      </div>

      {loading ? <Loader label="Loading events..." /> : null}
      {!loading && !list.length ? <EmptyState title="No events available" message="Published events will appear here." /> : null}
      {!loading && list.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {list.map((event) => {
            const postedBy = event.createdBy?.username;
            const postedRole = event.createdBy?.role;
            return (
              <article key={event._id} className="glass-panel p-6">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="text-left"
                  >
                    <h2 className="text-xl font-bold text-on-surface hover:text-primary hover:underline">{event.title}</h2>
                    <p className="mt-2 text-sm text-on-surface-variant">{formatDateTime(event.dateTime)}</p>
                  </button>
                  <div className="flex items-center gap-2">
                    <Tooltip text="View details"><button type="button" onClick={() => navigate(`/events/${event._id}`)} className="rounded-full bg-white p-2 text-primary"><Eye className="h-4 w-4" /></button></Tooltip>
                    {canManageNotice(event) ? <Tooltip text="Edit event"><button type="button" onClick={() => navigate(`/events/${event._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button></Tooltip> : null}
                    {canManageNotice(event) ? <Tooltip text="Delete event"><button type="button" onClick={() => setDeleteId(event._id)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button></Tooltip> : null}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge tone="primary">{getVisibilityLabel(event)}</Badge>
                  {postedBy ? (
                    <span className="text-xs text-on-surface-variant">
                      Posted by <span className="font-semibold text-on-surface">{postedBy}</span>{postedRole ? ` (${postedRole})` : ''}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-on-surface-variant">{truncate(event.description || 'No description provided.', 220)}</p>
              </article>
            );
          })}
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Event"
        message="This event will be removed from the active calendar."
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          const result = await dispatch(deleteEvent(deleteId));
          if (!result.error) setDeleteId(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Events;
