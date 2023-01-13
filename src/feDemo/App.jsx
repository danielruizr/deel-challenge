import React from 'react'
import { Tabs } from '@mantine/core';
import './global.css';
import { ProfileProvider } from './context/Profile';
import styles from './styles.module.css';
import ProfileSelector from './components/ProfileSelector';
import ProfileContracts from './components/ProfileContracts';
import ProfileJobs from './components/ProfileJobs';
import ClientDeposit from './components/ClientDeposit';


const App = () => {
  return (
    <ProfileProvider>
      <div className={styles.main}>

      <Tabs classNames={{root: styles.tabsRoot }} defaultValue="contracts">
        <div className={styles.header}>
          <ProfileSelector />
          <Tabs.List grow>
            <Tabs.Tab value="contracts">Contracts</Tabs.Tab>
            <Tabs.Tab value="jobs">Jobs</Tabs.Tab>
            <Tabs.Tab value="deposit">Deposit</Tabs.Tab>
          </Tabs.List>
        </div>

      <div className={styles.content}>
        <Tabs.Panel value="contracts">
          <ProfileContracts />
        </Tabs.Panel>
        <Tabs.Panel value="jobs">
          <ProfileJobs />
        </Tabs.Panel>
        <Tabs.Panel value="deposit">
          <ClientDeposit />
        </Tabs.Panel>
      </div>
    </Tabs>
      </div>
    </ProfileProvider>
  )
}

export default App