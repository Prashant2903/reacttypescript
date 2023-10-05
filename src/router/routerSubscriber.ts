import { RouterSubscriber } from '@remix-run/router'
const routerSubscriber: RouterSubscriber = routerState => {
  // You can define the logic that requires unified adjustment for routing changes here.
  // console.log(routerState.location)
}

export default routerSubscriber
