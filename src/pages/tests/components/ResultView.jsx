import { formatDate } from '../../../utils/formatters';

const ResultView = ({ results = [] }) => (
  <section className="glass-panel p-6">
    <h2 className="text-xl font-bold text-on-surface">Results</h2>
    {results.length === 0 ? (
      <p className="mt-4 text-sm text-on-surface-variant">No results found.</p>
    ) : (
      <div className="mt-4 space-y-3">
        {results.map((item) => {
          const testName = item.testId?.name || item.testName || '—';
          const subjectName = item.testId?.subjectId?.name || item.subjectName || '';
          const maxScore = item.testId?.maxScore ?? item.maxScore;
          const testDate = item.testId?.testDate || item.testDate;
          const pct = item.percentage != null ? Number(item.percentage).toFixed(1) : null;

          return (
            <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-on-surface">{testName}</p>
                  {subjectName ? <p className="mt-0.5 text-sm text-on-surface-variant">{subjectName}</p> : null}
                </div>
                {testDate ? <p className="shrink-0 text-sm text-on-surface-variant">{formatDate(testDate)}</p> : null}
              </div>
              <p className="mt-2 text-sm font-medium text-on-surface">
                {item.isAbsent
                  ? 'Absent'
                  : `${item.marksObtained} / ${maxScore ?? '?'}${pct ? ` · ${pct}%` : ''}`}
              </p>
            </div>
          );
        })}
      </div>
    )}
  </section>
);

export default ResultView;
