import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export function OverlayDialog({
  children,
  show,
  onClose = () => {},
  onSubmit = () => {},
}: any) {
  // console.log(error)
  return (
    <Dialog open={show} onClose={onClose}>
      <div
        className="fixed inset-0 left-0  z-20 top-0 w-screen h-screen bg-slate-900/90"
        aria-hidden="true"
      />
      <Transition
        show={show}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={Fragment}
      >
        <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center z-30 ">
          <Dialog.Panel className="mx-auto h-fit w-96 p-4 text-slate-200">
            {children}
          </Dialog.Panel>
        </div>
      </Transition>
    </Dialog>
  )
}
