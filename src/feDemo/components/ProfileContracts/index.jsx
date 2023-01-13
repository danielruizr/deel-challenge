import React, { useState, useEffect, useCallback } from 'react'
import { Table } from '@mantine/core';
import { getFromApi } from '../../clients/api' 
import { useActiveUser } from '../../context/Profile'

const ProfileContracts = () => {
  const [activeUser] = useActiveUser();
  const [contracts, setContracts] = useState([]);

  const getContracts  = async (userId) => {
    const contractsData = await getFromApi('/contracts', { profile_id: userId });
    setContracts(contractsData);
  }

  const renderRows = useCallback(() => {
    return contracts.map((contract) => (
    <tr>
      <td>{contract.id}</td>
      <td>{contract.status}</td>
      <td>{contract.terms}</td>
    </tr>
    ))
  }, [contracts])

  useEffect(() =>{
    if (activeUser) {
      getContracts(activeUser.id);
    }
  }, [activeUser])

  return (
    <div>
       <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Terms</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </Table>
    </div>
  )
}

export default ProfileContracts