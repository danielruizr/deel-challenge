import React, { useState, useCallback } from 'react'
import { Button, NumberInput } from '@mantine/core';
import styles from './styles.module.css';
import { postToApi } from '../../clients/api' 
import { useActiveUser } from '../../context/Profile'
import { formatNumberInput } from '../../utilities/formatCurrency';

const ClientDeposit = () => {
  const [activeUser] = useActiveUser();
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);

  const deposit = useCallback(async (userId, amountToDeposit) => {
    if (!userId || !amountToDeposit) {
      alert('To make a deposit you must select a client profile and add a deposit amount')
      return;
    }
    setLoading(true);
    try {
      await postToApi(`/balances/deposit/${userId}`, { amount: amountToDeposit }, { profile_id: userId });
      alert('The deposit was successful')
    } catch (error) {
      console.error(error);
      alert('There was an error while trying to make the deposit')
    } 
    setLoading(false);
  }, [])


  if (!activeUser || activeUser?.type !== 'client'){
    return (
      <div>
        <h4>To make a deposit you must select a client.</h4>
      </div>
    )
  }

  return (
    <div className={styles.depositContainer}>
        <NumberInput
          label="Deposit Amount"
          value={amount}
          onChange={(value) => setAmount(value)}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value || '')) && value
                    ? formatNumberInput(value)
                    : '$ '
          }
        /> 
        <Button loading={loading} disabled={loading} onClick={() => deposit(activeUser?.id, amount)}>Deposit</Button>
    </div>
  )
}

export default ClientDeposit