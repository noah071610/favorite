export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="one-layout">
      <div style={{ width: "100px", height: "100px", background: "blue" }}>one{"'"}s layout</div>
      {children}
    </div>
  )
}
