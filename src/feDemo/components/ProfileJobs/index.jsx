import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button } from '@mantine/core';
import { formatCurrency } from '../../utilities/formatCurrency';
import { getFromApi, postToApi } from '../../clients/api' 
import { useActiveUser } from '../../context/Profile'

const ProfileJobs = () => {
  const [activeUser] = useActiveUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getJobs  = async (userId) => {
    const jobsData = await getFromApi('/jobs/unpaid', { profile_id: userId });
    setJobs(jobsData);
  }

  const payJob = useCallback(async (job) => {
    if (!activeUser?.id || !job) {
      alert('To pay a job you must select a client profile and job that is pending payment')
      return;
    }
    if (job.price > activeUser.balance) {
      alert('Not enough funds to pay this job')
      return;
    }
    setLoading(true);
    try {
      await postToApi(`/jobs/${job.id}/pay`, null, { profile_id: activeUser?.id });
      await getJobs(activeUser?.id);
      alert('The payment was successful')
    } catch (error) {
      console.error(error);
      alert('There was an error while trying to make the payment')
    } 
    setLoading(false);
  }, [activeUser])

  const renderRows = useCallback(() => {
    return jobs.map((job) => (
    <tr>
      <td>{job.id}</td>
      <td>{job.description}</td>
      <td>{formatCurrency(job.price)}</td>
      <td>{
        activeUser?.type === 'client' && !job.paid
          ? 
          <Button disabled={loading} loading={loading} onClick={() => payJob(job)}>Pay</Button>
          : null
      }</td>
    </tr>
    ))
  }, [jobs, activeUser, loading])

  useEffect(() =>{
    if (activeUser) {
      getJobs(activeUser.id);
    }
  }, [activeUser])

  return (
    <div>
       <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </Table>
    </div>
  )
}

export default ProfileJobs