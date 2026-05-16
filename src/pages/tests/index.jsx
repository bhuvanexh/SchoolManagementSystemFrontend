import { Pencil, PenLine, PlusCircle, Send, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import Tooltip from '../../components/data-display/Tooltip';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useFilterParams from '../../hooks/useFilterParams';
import usePermission from '../../hooks/usePermission';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { fetchSubjects } from '../../redux/actions/subjectActions';
import { clearSubjects } from '../../redux/slices/subjectSlice';
import { deleteTest, fetchTests, publishTest } from '../../redux/actions/testActions';
import { buildOptions } from '../../utils/helpers';
import { formatDate } from '../../utils/formatters';

const Tests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useFilterParams();
  const role = useSelector((state) => state.auth.user?.role);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const subjects = useSelector((state) => state.subjects.list);
  const list = useSelector((state) => state.tests.list);
  const loading = useSelector((state) => state.tests.loading);
  const { isAdmin, isSubjectTeacherOf } = usePermission();
  const [confirm, setConfirm] = useState({ type: null, id: null });

  const selectedClass = useMemo(
    () => (params.classId ? classes.find((c) => c._id === params.classId) ?? null : null),
    [classes, params.classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (params.classId && classHasSections) {
      dispatch(fetchSectionsByClass(params.classId));
    }
  }, [dispatch, params.classId, classHasSections]);

  useEffect(() => {
    if (classHasSections && params.sectionId) {
      dispatch(fetchSubjects({ sectionId: params.sectionId }));
    } else if (!classHasSections && params.classId) {
      dispatch(fetchSubjects({ classId: params.classId }));
    } else {
      dispatch(clearSubjects());
    }
  }, [dispatch, classHasSections, params.classId, params.sectionId]);

  useEffect(() => {
    if (params.classId) {
      dispatch(fetchTests({ classId: params.classId, sectionId: params.sectionId, subjectId: params.subjectId }));
    }
  }, [dispatch, params.classId, params.sectionId, params.subjectId]);

  const columns = useMemo(
    () => [
      { header: 'Test Name', accessorKey: 'name' },
      { header: 'Subject', cell: ({ row }) => row.original.subjectId?.name || '—' },
      { header: 'Section', cell: ({ row }) => row.original.sectionId?.name || '—' },
      { header: 'Date', cell: ({ row }) => formatDate(row.original.date || row.original.testDate) },
      { header: 'Max Score', accessorKey: 'maxScore' },
      { header: 'Published', cell: ({ row }) => <Badge tone={row.original.isPublished ? 'success' : 'neutral'}>{row.original.isPublished ? 'Yes' : 'No'}</Badge> },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            {role !== 'student' && (isAdmin || isSubjectTeacherOf(row.original.subjectId?._id || row.original.subjectId))
              ? <Tooltip text="Edit test"><button type="button" onClick={() => navigate(`/tests/${row.original._id}`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button></Tooltip>
              : null}
            {role !== 'student' && (isAdmin || isSubjectTeacherOf(row.original.subjectId?._id || row.original.subjectId))
              ? <Tooltip text="Grade students"><button type="button" onClick={() => navigate(`/tests/${row.original._id}/grade`)} className="rounded-full bg-white p-2 text-primary"><PenLine className="h-4 w-4" /></button></Tooltip>
              : null}
            {role !== 'student' && !row.original.isPublished && (isAdmin || isSubjectTeacherOf(row.original.subjectId?._id || row.original.subjectId))
              ? <Tooltip text="Publish results"><button type="button" onClick={() => setConfirm({ type: 'publish', id: row.original._id })} className="rounded-full bg-white p-2 text-tertiary"><Send className="h-4 w-4" /></button></Tooltip>
              : null}
            {role !== 'student' && !row.original.isPublished && (isAdmin || isSubjectTeacherOf(row.original.subjectId?._id || row.original.subjectId))
              ? <Tooltip text="Delete test"><button type="button" onClick={() => setConfirm({ type: 'delete', id: row.original._id })} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button></Tooltip>
              : null}
          </div>
        ),
      },
    ],
    [isAdmin, isSubjectTeacherOf, navigate, role]
  );

  const filterCols = classHasSections ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <PageWrapper>
      <PageHeader
        title="Tests & Results"
        description="Create assessments, collect marks, publish results, and track performance."
        actions={role !== 'student' && (isAdmin || subjects.some((s) => isSubjectTeacherOf(s._id)))
          ? <Link to="/tests/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Test</span></PrimaryButton></Link>
          : null}
      />

      <div className={`glass-panel grid gap-4 p-6 ${filterCols}`}>
        <SelectInput
          label="Class"
          value={params.classId}
          onChange={(value) => {
            dispatch(clearSections());
            dispatch(clearSubjects());
            setParams({ classId: value, sectionId: '', subjectId: '' });
          }}
          options={buildOptions(classes)}
          placeholder="All classes"
        />
        {classHasSections ? (
          <SelectInput
            label="Section"
            value={params.sectionId}
            onChange={(value) => {
              dispatch(clearSubjects());
              setParams({ sectionId: value, subjectId: '' });
            }}
            options={buildOptions(sections)}
            placeholder="All sections"
            disabled={!params.classId}
          />
        ) : null}
        <SelectInput
          label="Subject"
          value={params.subjectId}
          onChange={(value) => setParams({ subjectId: value })}
          options={buildOptions(subjects)}
          placeholder="All subjects"
          disabled={classHasSections ? !params.sectionId : !params.classId}
        />
      </div>

      {loading ? <Loader label="Loading tests..." /> : null}
      {!loading && !list.length ? <EmptyState title="No tests found" message="Assessments created for subjects will appear here." /> : null}
      {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}

      <ConfirmDialog
        isOpen={Boolean(confirm.id)}
        title={confirm.type === 'publish' ? 'Publish Test' : 'Delete Test'}
        message={confirm.type === 'publish' ? 'Publishing will lock editing for teachers. Continue?' : 'Only unpublished tests can be removed. Continue?'}
        confirmText={confirm.type === 'publish' ? 'Publish' : 'Delete'}
        onCancel={() => setConfirm({ type: null, id: null })}
        onConfirm={async () => {
          const action = confirm.type === 'publish' ? publishTest(confirm.id) : deleteTest(confirm.id);
          const result = await dispatch(action);
          if (!result.error) setConfirm({ type: null, id: null });
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Tests;
