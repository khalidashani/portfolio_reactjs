import RunningCard from '../components/RunningCard';

function Running() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Running Progress</h1>
      <RunningCard />
    </div>
  );
}

export default Running;
