import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'

// ===================================
// Will be executed once before executing each Test Suites
// ===================================

// ========
// Required to load
// ========
import './utils/extensions/stringExtensions'
import './i18n'

// ========
// MOCK
// ========

export const mockedUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}))

// ==========
// LIFE CYCLE
// ==========

export const mswServer = setupServer()

beforeAll(() => {
  // API mocking
  mswServer.listen()
})

afterEach(() => {
  //API Handles 
  mswServer.resetHandlers()
})

afterAll(() => {
  // API mocking
  mswServer.close()
})
