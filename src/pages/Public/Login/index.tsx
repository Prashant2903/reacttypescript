import React, { useEffect } from 'react'
import useAppSelector from '@/utils/hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'
import FormTextInput from '@/components/form/FormTextInput'
import useLoginForm from './hook/useLoginForm'
import { Form, Formik } from 'formik'
import Button from '@/components/Button'

interface IProps { }

const Login = (props: IProps) => {
  const navigate = useNavigate()
  const isLogin = useAppSelector(s => s.app.isLogin)

  // Example: formik (extract logic to hook to reduce the complexity of this component)
  const form = useLoginForm({ userId: '', pcode: '' })

  useEffect(() => {
    // Logged-in users will be redirected directly to the homepage after login.
    if (isLogin) navigate('/home')
  }, [isLogin, navigate])

  return <div className='pg-login'>

    <div className='box'>

      <div className='box__left'>

      </div>

      <div className='box__right '>

        <Formik
          enableReinitialize
          initialValues={form.initFormValues}
          validationSchema={form.validationSchema()}
          onSubmit={form.onFormSubmit}
          validateOnMount
        >
          {({ isValid }) => (
            <Form className='form'>

              <h1 className='form__title'>Login</h1>

              <p className='form__desc'>
                This is a login page that you can enter your user id and password to login system.
              </p>

              <div className='form__input-group'>
                <label htmlFor='userId'>User Id</label>
                <FormTextInput id='userId' name='userId' type='text' />
              </div>

              <div className='form__input-group'>
                <label htmlFor='pcode'>password</label>
                <FormTextInput id='pcode' name='pcode' type='password' />
              </div>

              <div className='form__action-group'>
                <Button className='form__btn' type='submit' outfit='primary' disabled={!isValid}>Login System</Button>
              </div>

            </Form>
          )}
        </Formik>
      </div>

    </div>

  </div>
}

export default Login
