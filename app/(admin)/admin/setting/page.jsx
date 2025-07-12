import SettingPage from "./components/settingPage"

export async function generateMetadata() {
  return {
    title: `Setting | AIvana Admin`,
    description: `Manage users in your website`,
  };
}

const page = async() => {
  return (
<div>
  <SettingPage/>
</div>
      
  )
}
export default page