import Dashboard from "./components/dashboard"

export async function generateMetadata() {
  return {
    title: `Dashboard | AIvana Admin`,
    description: `Admin dashboard for AIvana Shopping`,
  };
}


const AdminPage = () => {
  return (
    <div>
      <Dashboard/>
    </div>
  )
}
export default AdminPage