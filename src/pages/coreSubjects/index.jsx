import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import {
  createCoreSubject,
  deleteCoreSubject,
  fetchCoreSubjects,
  updateCoreSubject,
} from '../../redux/actions/coreSubjectActions';

const CoreSubjects = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.coreSubjects);
  const [newValue, setNewValue] = useState('');
  const [editState, setEditState] = useState({ id: null, value: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchCoreSubjects());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    const result = await dispatch(createCoreSubject({ name: newValue.trim() }));
    if (!result.error) setNewValue('');
  };

  const handleSave = async () => {
    const result = await dispatch(updateCoreSubject({ id: editState.id, name: editState.value.trim() }));
    if (!result.error) setEditState({ id: null, value: '' });
  };

  return (
    <PageWrapper>
      <PageHeader title="Core Subjects" description="Manage the school-wide subject master list used for teacher specialization and subject creation." />

      <section className="glass-panel p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
            className="input-field flex-1"
            placeholder="Add a core subject"
          />
          <PrimaryButton type="button" onClick={handleAdd} disabled={!newValue.trim() || loading}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </span>
          </PrimaryButton>
        </div>

        {loading ? <Loader label="Loading core subjects..." /> : null}
        {!loading && !list.length ? (
          <EmptyState title="No core subjects yet" message="Add your first core subject to start configuring teachers and class subjects." />
        ) : null}

        {!loading && list.length ? (
          <div className="space-y-3">
            {list.map((item) => {
              const editing = editState.id === item._id;
              return (
                <div key={item._id} className="flex flex-col gap-3 rounded-glass-sm bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  {editing ? (
                    <input
                      value={editState.value}
                      onChange={(event) => setEditState({ id: item._id, value: event.target.value })}
                      className="input-field flex-1"
                    />
                  ) : (
                    <p className="font-semibold text-on-surface">{item.name}</p>
                  )}

                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <SecondaryButton type="button" onClick={() => setEditState({ id: null, value: '' })}>
                          <span className="inline-flex items-center gap-2"><X className="h-4 w-4" /> Cancel</span>
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={handleSave} disabled={!editState.value.trim() || loading}>
                          Save
                        </PrimaryButton>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setEditState({ id: item._id, value: item.name })} className="rounded-full bg-white px-3 py-2 text-primary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setDeleteId(item._id)} className="rounded-full bg-white px-3 py-2 text-error">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Core Subject"
        message="This will remove the core subject if it is not in use. Continue?"
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await dispatch(deleteCoreSubject(deleteId));
          setDeleteId(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default CoreSubjects;
