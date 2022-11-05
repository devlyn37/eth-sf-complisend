// import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import React,{useState,useEffect,Fragment} from 'react'
import { Head, MetaProps } from './Head'
import cn from 'classnames'
import { Dialog,Transition } from '@headlessui/react'



interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}



const LoadingOverlay = ({props}:any): any => {
  <div className='fixed bg-slate-900 w-full h-full text-white min-h-screen p-2'>
   loading
  </div>
}





export function OverlayDialog({children,show,onClose,onSubmit}:any){
    // console.log(error)
    return (
        <Dialog open={show} onClose={onClose}>
        <div className="fixed inset-0 left-0  z-20 top-0 w-screen h-screen bg-slate-900/90" aria-hidden="true" />
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
            <Dialog.Panel className = 'mx-auto h-fit w-96 p-4 text-slate-200'>
              {children}
              <div className='p-2 w-full flex items-center justify-center flex-row'>
                <button className='bg-blue-500 rounded-md p-2 px-4 m-4' onClick={onSubmit}>submit</button>
              </div>
            </Dialog.Panel>
        </div>
        </Transition>
        </Dialog>
    )
}



const SetTokenForm = ({state,onSet}:any): any => {
  const [amount,setAmount] = useState(0)
  const [open_form,setFormOpen] = useState(false)

  const onSetAmountChange = (e:any) => {
    setAmount(e.target.value)
  }

  const onSubmit = (e:any) => {
    e.preventDefault()
    console.log('submit')
    onSet({
      amount:amount,
    })
    setFormOpen(false)
  }
  
  return <div className='rounded-md p-4 bg-slate-700 cursor-pointer' onClick={setFormOpen.bind(null,true)}>
    <OverlayDialog show={open_form} onSubmit={onSubmit} onClose={setFormOpen.bind(null,false)}>
      <div className='p-2'>set token</div>
      <input className='bg-slate-800 p-6 text-lg' onChange={onSetAmountChange} value={amount}></input>
    </OverlayDialog>
    <div >
      select token
    </div>
  </div>
}



const SetNotesForm = ({state,onSet}:any): any => {
  const [notes,setNotes] = useState(0)
  const [open_form,setFormOpen] = useState(false)

  const onSetNotesChange = (e:any) => {
    setNotes(e.target.value)
  }

  const onSubmit = (e:any) => {
    e.preventDefault()
    console.log('submit')
    onSet({
      notes:notes,
    })
    setFormOpen(false)
  }
  
  return <div className='rounded-md p-4 bg-slate-700 cursor-pointer' onClick={setFormOpen.bind(null,true)}>
    <OverlayDialog show={open_form} onSubmit={onSubmit} onClose={setFormOpen.bind(null,false)}>
      <div className='p-2'>set notes</div>
      <textarea className='bg-slate-800 p-6 text-lg' onChange={onSetNotesChange} value={notes} placeholder='set notes'></textarea>
    </OverlayDialog>
    <div >
      set notes
    </div>
  </div>
}



{/* let [addr,setAddr] = useState('')
  
let onAddrChange = function(e:any){
  setAddr(e.target.value)
} */}


const AuthForm = ({props}:any): any => {
  return <>
    <div className={'bg-slate-800 rounded-md p-5'}>
      <ConnectButton />
    </div>
  </>
}

const SetRecieverForm = ({state={},onSet}:any): any => {
  const [address,setAddress] = useState(0)
  const [open_form,setFormOpen] = useState(false)

  const onSetAddressChange = (e:any) => {
    setAddress(e.target.value)
  }

  const onSubmit = (e:any) => {
    e.preventDefault()
    // console.log('submit')
    onSet({
      address:address,
    })
    setFormOpen(false)
  }

  console.log(open_form)
  
  return <div className='rounded-md p-4 bg-slate-800 cursor-pointer' onClick={setFormOpen.bind(null,true)}>
    <OverlayDialog show={open_form} onSubmit={onSubmit} onClose={setFormOpen.bind(null,false)}>
      <div className='p-2'>set reciever</div>
      <input className='bg-slate-800 p-6 text-lg' onChange={onSetAddressChange} value={address} placeholder='select address'></input>
    </OverlayDialog>
    <div >
      {!address ? 'select address' : address}
    </div>
  </div>
}

const SubmitForm = ({props}:any): any => {

  let [token_state,setTokenState] = useState({})
  let [reciever_state,setRecieverState] = useState({})
  let [notes_state,setNotesState] = useState({})

  let submitTransaction = function(){
    // combine token_state & notes_state and submit
  }

  return <>
      <div className='flex bg-slate-900 flex-col max-w-2xl w-screen p-4 rounded-md'>
        <div className='m-2'>
          <SetTokenForm state={token_state} onSet={setTokenState}></SetTokenForm>
        </div>
        <div className='m-2'>
          <SetRecieverForm value={reciever_state} onSet={setRecieverState}></SetRecieverForm>
        </div>
        <div className='m-2'>
          <SetNotesForm value={notes_state} onSet={setNotesState}></SetNotesForm>
        </div>
       
        
        
        <div className='w-full p-4 flex items-center justify-center'> 
          <button className='p-3 px-8 bg-blue-600 rounded-xl font-black' onClick={submitTransaction}>SEND</button>
        </div>
      </div>
  </>
}


const Trx = ({props}:any): any => {
  return <div className='flex p-2 rounded-md'>

  </div>
}

const TrxList = ({props}:any): any => {

}






export const App = ({customMeta }: LayoutProps): JSX.Element => {

  return (
    <>
      <Head customMeta={customMeta} />
      {/* <header> */}
      <header className='bg-slate-800 w-full h-full overflow-y-scroll text-white min-h-screen p-2'>
        <div className='flex flex-col items-center'>
          <h1 className='text-center p-6 text-4xl'>COMPLISEND</h1>
          <div className='p-4'>
            <AuthForm />
          </div>
          <div className='p-4'>
            <SubmitForm />
          </div>
          <div className='p-4'>
            <TrxList />
          </div>
          
          
          
        </div>
      </header>

    </>
  )
}
