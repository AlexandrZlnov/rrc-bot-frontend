import Nav from './Nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <Nav />
      <main style={{ padding: '1rem' }}>{children}</main>
    </div>
  );
}
