import { createTest, destroyVM } from '../util'
import Hello from '../../components/hello'

describe('Hello', () => {
  let vm
  afterEach(() => {
    destroyVM(vm)
  })

  test('create', () => {
    vm = createTest(
      Hello,
      {
        title: 'test',
      },
      true,
    )
    expect(vm.$el.classList.contains('hd-ui-hello__title')).toBe(true)
    setTimeout(() => {
      expect(vm.$el.querySelector('.hd-ui-hello__title').textContent).toBe('hello hd ui')
    }, 300)
  })
})
