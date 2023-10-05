import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GenderEnum, LangEnum } from '@/constants/enums'
import environment from '@/environment'
import storage from '@/utils/storage'
import { Formik, Form } from 'formik'
import FormTextInput from '@/components/form/FormTextInput'
import { useRef, useState } from 'react'
import { getEnumDescription, getEnumOptions } from '@/utils/helpers/decoratorHelper'
import { decrement, increment, incrementAsync, incrementAsyncSimple, selectCount } from '@/store/slices/counterSlice'
import useClickOutsideHandler from '@/utils/hooks/useClickOutsideHandler'
import useAppDispatch from '@/utils/hooks/useAppDispatch'
import useAppSelector from '@/utils/hooks/useAppSelector'
import sampleApi from '@/services/api/sampleApi'
import { ISampleGetUserReq } from '@/services/models/sample'
import { selectLoadingApiCounter } from '@/store/slices/appSlice'
import useSampleForm from './hooks/useSampleForm'
import SampleImg from './components/SampleImg'
import MsgBox from '@/components/MsgBox'
import { showMsgBox } from '@/utils/helpers/msgHelper'
import Modal from '@/components/common/Modal'
import { unwrapResult } from '@reduxjs/toolkit'

interface IProps {
  title?: string
  onSomethingDone?: () => void
}

const Sample = (props: IProps) => {
  // Example: route
  const navigate = useNavigate()
  const { userId } = useParams() // get params from url

  // Example: i18n
  const { t, i18n } = useTranslation()
  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    storage.lang = lang
  }

  // Example: select items from enum
  const [selectedGender, setSelectedGender] = useState(GenderEnum.MALE)

  // Example: formik (extract logic to hook to reduce the complexity of this component)
  const form = useSampleForm({ account: '', password: '', age: null, salary: null })

  // Example: redux
  const counterValue = useAppSelector(state => state.counter.value)
  const counterValueSame = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  // Example: hook
  const targetDiv = useRef<HTMLElement>(null)
  useClickOutsideHandler(targetDiv, () => console.log('outside of the area clicked!!'), true)

  // Example: call mutation api (no cached)
  const loadingApiCounter = useAppSelector(selectLoadingApiCounter)
  const [apiSampleGetProducts] = sampleApi.useSampleGetProductsMutation()
  const handleCallSampleGetProductsApi = async () => {
    const response = await apiSampleGetProducts({ category: 'pc' }).unwrap()
    const { header: { returnCode, returnMsg }, body } = response
    if (returnCode.isSuccessCode()) {
      console.log(body)
    } else {
      alert(`${returnCode}:${returnMsg}`)
    }
  }

  const [apiSampleGetUser] = sampleApi.useSampleGetUserMutation()
  const [username, setUsername] = useState('')
  const handleCallSampleGetUserApi = async () => {
    const req: ISampleGetUserReq = { userId: 'chris' }
    const response = await apiSampleGetUser(req).unwrap()
    const { header: { returnCode, returnMsg }, body } = response
    if (returnCode.isSuccessCode()) {
      setUsername(`${body.username} ${body.firstName}`)
    } else {
      alert(`${returnCode}:${returnMsg}`)
    }
  }

  // Example: call query api (cached) - direct execution
  // => Please refer to the <SampleImg /> component content, and the image will be downloaded and cached upon loading.

  // Example: call query api (cached) - manual execution
  const [lazyBase64Img, setLazyBase64Img] = useState('')
  const [apiSampleGetImg] = sampleApi.useLazySampleGetImgQuery() // Custom call api time
  const handleCallLazyCachedApi = async () => {
    const img = await apiSampleGetImg({ height: 200, width: 800 }, true /* cached */).unwrap()
    setLazyBase64Img(img)
  }

  // Example: Pop-up window template design & general text message pop-up window call method
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLocalMsgBoxVisible, setIsLocalMsgBoxVisible] = useState(false)

  // ===

  return <div className='pg-dev'>

    <h1>Dev - Sample Page</h1>

    <section className='section'>
      <h2 className='section__title'>development environment</h2>
      <ul>
        <li>env: {environment.appEnv}</li>
        <li>mode: {environment.appMode}</li>
      </ul>
    </section>

    <section className='section'>
      <h2 className='section__title'>Use navigation</h2>
      user id from url: {userId}
      <br />
      <input type='button' value='go to /dev/sample/user01' onClick={() => { navigate('/dev/sample/user01') }} data-testid='goUser01Btn' />
      <br />
      <input type='button' value='go to /dev/sample/user02' onClick={() => { navigate('/dev/sample/user02') }} />
      <br />
      <Link data-testid='goUser03Link' to='/dev/sample/user03?id=1234'>go to /dev/sample/user03 by link</Link>
    </section>

    <section className='section' >
      <h2 className='section__title'>Use Enum to generate menus</h2>
      <div>
        <p>Use GenderEnum to generate menus</p>
        <select name='gender' id='gender' value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
          {getEnumOptions(GenderEnum).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        The defined description text can be obtained using the GenderEnum value
      </div>
      <input type='button' value='get description' onClick={() => {
        const description = getEnumDescription(GenderEnum, selectedGender)
        alert(`gender value '${selectedGender}' is ${description}`)
      }} />
    </section>

    <section className='section'>
      <h2 className='section__title'>Multilingual</h2>
      <ul>
        <li>Current Language: {i18n.language}</li>
        <li>{t('__understand')}</li>
      </ul>
      <br />
      <input type='button' value='en' onClick={() => { changeLang(LangEnum.EN) }} />
      <input type='button' value='zh-TW' onClick={() => { changeLang(LangEnum.ZH_TW) }} />
    </section>

    <section className='section'>
      <h2 className='section__title'>form check</h2>

      <Formik
        enableReinitialize
        initialValues={form.initFormValues}
        validationSchema={form.validationSchema}
        onSubmit={form.onFormSubmit}
      >
        {({ dirty, isValid, resetForm, values }) => (
          <Form >

            <div className='input-group'>
              <label className='input-group__label' htmlFor='account' > {t('__account' /* account number */)}</label>
              <FormTextInput className='input-group__input' id='account' name='account' type='text' />
            </div>

            <div className='input-group'>
              <label className='input-group__label' htmlFor='password' > {t('__pwd' /* password */)} </label>
              <FormTextInput className='input-group__input' id='password' name='password' type='password' />
            </div>

            <div className='input-group'>
              <label className='input-group__label' htmlFor='age' > {t('__age' /* age */)} </label>
              <FormTextInput className='input-group__input' id='age' name='age' type='number' />
            </div>

            <div className='input-group'>
              <label className='input-group__label' htmlFor='salary' > {t('__salary' /* monthly salary */)} </label>
              <FormTextInput className='input-group__input' id='salary' name='salary' type='number' caption={t('__useTwd' /* Use Taiwan dollars as the unit */)} />
            </div>

            <input
              type='button'
              onClick={() => resetForm({ values: form.initFormValues })}
              value={t('__clear' /* Clear */)!} />

            <input
              type='submit'
              disabled={!(dirty && isValid)}
              value={t('__submit' /* send */)!} />

            <br />

            <input
              type='button'
              onClick={() => form.setInitFormValues({ ...form.initFormValues, salary: values.salary !== null ? values.salary + 1 : 0 })}
              value={'Use enableReinitialize to re-give the initial value to re-init the form (may be data from the remote end)'} />

          </Form>
        )}
      </Formik>
    </section>

    <section className='section'>
      <h2 className='section__title'>Redux Toolkit</h2>
      <p>counter: {counterValue} = {counterValueSame}</p>
      <br />
      <input type='button' value='+' onClick={() => { dispatch(increment()) }} data-testid='addCounterBtn' />
      <input type='button' value='-' onClick={() => { dispatch(decrement()) }} />
      <input type='button' value='thunk' onClick={async () => {
        const resultAction = await dispatch(incrementAsync(10))
        const result = unwrapResult(resultAction)
        console.log(result)
      }} />
      <input type='button' value='thunk-simple (not able to be traced in redux dev tool)' onClick={async () => {
        const result = await dispatch(incrementAsyncSimple(10))
        console.log(result)
      }} />

    </section>

    <section className='section' ref={targetDiv}>
      <h2 className='section__title'>Custom Hook</h2>
      <p>When clicking beyond this area, there will be a message in the console.</p>
      <p>line1------</p>
      <p>line2------</p>
      <p>line3------</p>
    </section>

    <section className='section'>
      <h2 className='section__title'>呼叫api</h2>
      <p>loadingApiCounter: {loadingApiCounter}</p>
      <div>
        <h3>mutation (no cache)</h3>
        <input type='button' value='call SampleGetProducts api(Not included in loader)' onClick={handleCallSampleGetProductsApi} /> <br />
        <input type='button' value='call SampleGetUser api(Included in loader)' onClick={handleCallSampleGetUserApi} data-testid='callSampleGetUserApiBtn' />
        {username && <p data-testid='username'>username : {username}</p>}
      </div>
      <div>
        <h3> query (with cache)</h3>
        <p>Use query to directly execute SampleGetImg api to obtain images</p>
        <SampleImg width={800} height={200} />
      </div>
      <div>
        <span>Use query-lazy to manually execute SampleGetImg api to obtain images</span>
        <input type='button' value='get image' onClick={handleCallLazyCachedApi} />
        <div> <img alt='' src={lazyBase64Img} /> </div>
      </div>
    </section>

    <section className='section'>
      <h2 className='section__title'>Additional scenarios for unit testing</h2>
      <div>
        <input data-testid='doSomethingBtn' type='button' value='Call the callback passed in by the component'
          onClick={() => { props?.onSomethingDone && props.onSomethingDone() }} /> <br />
        <p data-testid='title'>{props.title}</p>
      </div>

    </section>

    <section className='section'>
      <h2 className='section__title'>Pop-up window template design & universal text message pop-up window call method</h2>
      <div>
        <input type='button' value='Show basic Modal popup window' onClick={() => { setIsModalVisible(true) }} />
        <input type='button' value='Display the MsgBox pop-up window after assembling the Modal' onClick={() => { setIsLocalMsgBoxVisible(true) }} />
        <input type='button' value="Use the app\'s universal message queue to display messages (send two)" onClick={() => {
          showMsgBox({
            content: 'This is the first message',
            title: 'message queue',
            mainBtn: { label: 'I see', onClick: () => console.log('I see') },
            minorBtn: { label: '關閉' }
          })
          showMsgBox({
            content: 'This is the second message. There is an x ​​close button in the upper right corner. You can click to close it, or you can press Esc or click on the non-pop-up window area to close it.',
            title: 'message queues',
            mainBtn: { label: 'Sure' },
            hasCloseBtn: true
          })
        }} />

        <Modal
          isVisible={isModalVisible}
          isCloseByBackdrop
          isCloseByEsc
          onRequestClose={() => setIsModalVisible(false)} >
          <div>This is a Modal component with only an outer frame and provides basic functions.</div>
          <div>You can assemble the required window content components by yourself</div>
        </Modal>

        <MsgBox
          title='Information'
          content='This is the MsgBox component assembled using the Modal component'
          isVisible={isLocalMsgBoxVisible}
          mainBtn={{ label: 'Ok', onClick: () => console.log('ok clicked') }}
          minorBtn={{ label: 'Cancel' }}
          onRequestClose={() => setIsLocalMsgBoxVisible(false)} />

      </div>

    </section>

  </div>
}

export default Sample
