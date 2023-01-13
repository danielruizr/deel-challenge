import React, { useEffect, useState, useCallback } from 'react'
import { getFromApi } from '../../clients/api';
import { Avatar, Menu } from '@mantine/core';
import { useActiveUser } from '../../context/Profile';
import { formatCurrency } from '../../utilities/formatCurrency';
import styles from './styles.module.css';


const ProfileSelector = () => {
    const [activeUser, setActiveUser] = useActiveUser();
    const [profiles, setProfiles] = useState([]);

    const getProfiles = async () => {
      const profilesData = await getFromApi('/profiles');
      setProfiles(profilesData);
      setActiveUser(profilesData[0])
    }

    useEffect(() => {
      getProfiles();
    }, [])


    const renderProfiles = useCallback(() => {
        return profiles.map((profile) => 
        (
          <Menu.Item icon={<Avatar size="xs" color="cyan" radius="xl">{profile.firstName.charAt(0)+profile.lastName.charAt(0)}</Avatar>} onClick={() => setActiveUser(profile)}>
            {profile.firstName} {profile.lastName}
          </Menu.Item>
        )
        )
      }, [profiles])



  return (
    <Menu shadow="md" width={200}>
        <Menu.Target>
          { 
            activeUser ? 
              <button className={styles.profileSelector}>
                <Avatar color="cyan" radius="xl">
                  {activeUser.firstName.charAt(0)+activeUser.lastName.charAt(0)}
                </Avatar>
                <div>
                  <h3>{activeUser.firstName} {activeUser.lastName}</h3>
                  <p>{formatCurrency(activeUser.balance)} - {activeUser.type}</p>
                </div>
              </button>
              :
              <Avatar color="cyan" radius="xl"/> 
          }
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Label>Users</Menu.Label>
            {renderProfiles()}
        </Menu.Dropdown>
    </Menu>
  )
}

export default ProfileSelector