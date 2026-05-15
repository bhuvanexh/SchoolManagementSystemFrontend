import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SearchInput from '../inputs/SearchInput';
import SelectInput from '../inputs/SelectInput';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { buildOptions } from '../../utils/helpers';
import useFilterParams from '../../hooks/useFilterParams';

const ClassSectionFilter = ({
  showSearch = false,
  searchPlaceholder = 'Search...',
  showSection = true,
  classOptions: externalClassOptions = null,
  extra = null,
  disabled = false,
  className = '',
}) => {
  const dispatch = useDispatch();
  const [params, setParams] = useFilterParams();
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);

  const defaultClassOptions = useMemo(() => buildOptions(classes), [classes]);
  const classOptions = externalClassOptions ?? defaultClassOptions;

  // Determine if the selected class has sections (null = no class selected or class not yet in list)
  const selectedClass = useMemo(
    () => (params.classId ? classes.find((c) => c._id === params.classId) ?? null : null),
    [classes, params.classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  const sectionOptions = useMemo(
    () => (classHasSections ? buildOptions(sections) : []),
    [sections, classHasSections]
  );

  // Fetch sections only when the selected class actually has sections
  useEffect(() => {
    if (params.classId && classHasSections) {
      dispatch(fetchSectionsByClass(params.classId));
    }
  }, [params.classId, classHasSections, dispatch]);

  return (
    <div className={`glass-panel grid gap-4 p-6 ${className}`.trim()}>
      <SelectInput
        label="Class"
        value={params.classId}
        onChange={(value) => {
          dispatch(clearSections());
          setParams({ classId: value, sectionId: '' });
        }}
        options={classOptions}
        placeholder="All classes"
        disabled={disabled}
      />
      {showSection && classHasSections ? (
        <SelectInput
          label="Section"
          value={params.sectionId}
          onChange={(value) => setParams({ sectionId: value })}
          options={sectionOptions}
          placeholder="All sections"
          disabled={disabled}
        />
      ) : null}
      {showSearch ? (
        <SearchInput
          value={params.search}
          onChange={(e) => setParams({ search: e.target.value })}
          placeholder={searchPlaceholder}
          disabled={disabled}
        />
      ) : null}
      {extra}
    </div>
  );
};

export default ClassSectionFilter;
