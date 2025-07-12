import { SignUp } from "@clerk/nextjs"

export async function generateMetadata() {
  return {
    title: `User SignUp | AIvana`,
    description: `User sign-up`,
  };
}

const page = () => {
  return (
    <div>
        <SignUp/>
    </div>
  )
}
export default page