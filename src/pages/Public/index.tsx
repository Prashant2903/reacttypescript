import { Outlet } from 'react-router-dom'
import AppLayout from '@/containers/AppLayout'

interface IProps { }

/**
 * Shared template for public pages
 */
const Public = (props: IProps) => {
  return (
    <AppLayout>

      {/* child route page */}
      <Outlet />

    </AppLayout>
  )
}

export default Public
