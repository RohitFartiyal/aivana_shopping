import { SignIn } from "@clerk/nextjs"

export async function generateMetadata() {
  return {
    title: `User SignIn | AIvana`,
    description: `User sign-in`,
  };
}

const page = () => {
  return (
    <div>
        <SignIn/>
    </div>
  )
}
export default page