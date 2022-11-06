import cn from 'classnames'
import XmtpContext from '../context/xmtp'
import React, { useState, useCallback, useContext } from 'react'
import {useAccount} from 'wagmi'
import { LoaderBar } from './LoaderBar'


export const Txn = ({ txn }: any): any => {
	return (
	  <div className="flex p-2 rounded-md bg-slate-900 m-2">{JSON.stringify(txn)}</div>
	)
  }
  