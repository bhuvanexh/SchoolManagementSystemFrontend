const ResultView = ({ results = [] }) => (
  <section className="glass-panel p-6">
    <h2 className="text-xl font-bold text-on-surface">Results</h2>
    <div className="mt-4 space-y-3">
      {results.map((item) => (
        <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
          <p className="font-semibold text-on-surface">{item.testName || item.subjectName}</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {item.isAbsent ? 'AB' : `${item.marksObtained} / ${item.maxScore}`} {item.percentage ? `· ${item.percentage}%` : ''}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default ResultView;
