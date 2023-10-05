import { FormikHelpers } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import sampleApi from '@/services/api/sampleApi'
import { loginSuccess } from '@/store/slices/appSlice'
import { getRequiredMsg } from '@/utils/helpers/commonHelper'
import { showMsgBox } from '@/utils/helpers/msgHelper'
import useAppDispatch from '@/utils/hooks/useAppDispatch'

interface IFormValues {
  userId: string
  pcode: string
}

const useLoginForm = (initValues: IFormValues) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [initFormValues, setInitFormValues] = useState(initValues)
  const [apiSampleLogin] = sampleApi.useSampleLoginMutation()

  const validationSchema = () =>
    yup.object({
      // If a required error message requires a field name, overwrite the message like this and just pass in the field name
      userId: yup.string().required(getRequiredMsg(t('__account'))),
      // If a required error message does not require a field name, respond to the default generic message "Please enter information"
      pcode: yup.string().required()
    })

  const onFormSubmit = async (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
    const request = { pcode: values.pcode, userId: values.userId }
    const response = await apiSampleLogin(request).unwrap()
    const { header: { returnCode, returnMsg }, body } = response
    if (returnCode.isSuccessCode()) {
      dispatch(loginSuccess({ authToken: body.authCode }))
    } else {
      showMsgBox({ title: 'login', content: `Login failed(${returnCode}:${returnMsg})` })
    }
    actions.setSubmitting(false)
  }

  return { initFormValues, setInitFormValues, validationSchema, onFormSubmit }
}

export default useLoginForm
