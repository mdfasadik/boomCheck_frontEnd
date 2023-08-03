import Auth from "@/components/utils/Auth"
import Logout from "@/components/utils/Logout"

function ProfileLayout({ children }) {
    return (
        <>
            <Auth />
            <Logout />
            {children}
        </>
    )
}

export default ProfileLayout