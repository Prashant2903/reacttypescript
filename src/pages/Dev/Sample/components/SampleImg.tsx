
import React from 'react'
import sampleApi from '@/services/api/sampleApi'

// Explain when to use Component:
// - It is not necessary to separate Component only because it needs to be shared.
// - When the page logic is too complex, you can also remove the Component to reduce the page complexity.

interface IProps {
  width: number
  height: number
}

const SampleImg = (props: IProps) => {
  // call query api (cached) - Direct execution
  const { data: base64Img/*, isLoading, isError, refetch */ } =
    sampleApi.useSampleGetImgQuery({ height: props.height, width: props.width }, {
      // pollingInterval: 60_000 // pull data every 1 minute
    })
  return (
    <img alt='' src={base64Img} />
  )
}

export default SampleImg
