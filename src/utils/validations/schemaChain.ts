
import * as yup from 'yup'
import { getRequiredMsg } from '../helpers/commonHelper'
import { maxDigitNumberSchema } from './schema'

/**
 * Create a composite schema logical string (composite logic)
 * Establishing general and meaningful data checking logic
 */

export default {

  /**
   * Taiwan dollar amount check logic [must be greater than 0 and the upper limit is 10 digits] (e.g. monthly income, loan amount)
   * @param isRequired Is it required?
   * @param name Field name
   * @returns
   */
  twMoneyAmt: (isRequired: boolean, name?: string) => {
    return yup
      .number()
      .concat(
        isRequired
          ? name
            ? yup.number().required(getRequiredMsg(name))
            : yup.number().required()
          : yup.number().nullable())
      .integer()
      .moreThan(0)
      .concat(maxDigitNumberSchema(10))
  }

}
