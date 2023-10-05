import { FormikHelpers } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { getRequiredMsg } from '@/utils/helpers/commonHelper'
import { strLengthRangeSchema } from '@/utils/validations/schema'
import schemaChain from '@/utils/validations/schemaChain'

// Explain when to use Hook:
// - It is not necessary to remove Hook only because it needs to be shared.
// - When the page logic is too complex, you can also remove the Hook to reduce the page complexity

// Define form data
interface IFormValues {
  account: string
  password: string
  age: number | null
  salary: number | null
}

const useSampleForm = (initValues: IFormValues) => {
  const { t } = useTranslation()
  const [initFormValues, setInitFormValues] = useState(initValues)

  // Check logic
  const validationSchema = () =>
    yup.object({
      account:
        // If a required error message requires a field name, overwrite the message like this and just pass in the field name
        yup.string().required(getRequiredMsg(t('__account' /* account number */)))
          .max(5), // Built-in logic
      password:
        // If a required error message does not require a field name, respond with the default generic message "Please enter information
        yup.string().required()
          .concat(strLengthRangeSchema(2, 10)), // custom logic
      age:
        // When a number is not required, nullable must be added to allow null values.
        yup.number().nullable(), // Built-in logic
      salary:
        schemaChain
          .twMoneyAmt(false, t('__salary' /* monthly salary */)!) // Custom logical string (for common and meaningful data types)
    })

  // Submit form
  const onFormSubmit = (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
    alert(JSON.stringify(values, null, 2))
    actions.setSubmitting(false)
  }

  // Return form information to the consuming component
  return { initFormValues, setInitFormValues, validationSchema, onFormSubmit }
}

export default useSampleForm
